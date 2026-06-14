import * as k8s from '@kubernetes/client-node';
import { Surreal } from 'surrealdb';

const GROUP = 'fabric.agennext.io';
const VERSION = 'v1alpha1';
const PLURAL = 'agents';

const SURREAL_ENDPOINT = process.env.SURREAL_ENDPOINT || 'ws://surrealdb.fabric.svc.cluster.local:8000';
const SURREAL_USER = process.env.SURREAL_USER || 'root';
const SURREAL_PASS = process.env.SURREAL_PASS || 'ChangeMeNow';
const SURREAL_NS = process.env.SURREAL_NS || 'agennext';
const SURREAL_DB = process.env.SURREAL_DB || 'fabric';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const customObjectsApi = kc.makeApiClient(k8s.CustomObjectsApi);
const watch = new k8s.Watch(kc);

const db = new Surreal();

function toRecordId(name) {
  return name.replaceAll('-', '_').toLowerCase();
}

function agentToSurreal(agent) {
  const spec = agent.spec || {};
  const trust = spec.trust || {};
  const lifecycle = spec.lifecycle || {};
  const runtime = spec.runtime || {};

  return {
    name: spec.displayName || agent.metadata.name,
    description: spec.description || '',
    objective: spec.objective || '',
    status: spec.status || 'draft',
    lifecycle: lifecycle.state || 'Draft',
    trust_score: trust.score ?? 0,
    runtime_mode: runtime.mode || 'manual',
    approvals: runtime.approvals || 'required',
    owner: spec.owner || {},
    skills: spec.skills || [],
    tools: spec.tools || [],
    policies: spec.policies || [],
    constraints: spec.constraints || {},
    kubernetes: {
      namespace: agent.metadata.namespace,
      name: agent.metadata.name,
      uid: agent.metadata.uid,
      resource_version: agent.metadata.resourceVersion,
      generation: agent.metadata.generation,
    },
    updated_at: new Date().toISOString(),
  };
}

async function ensureSchema() {
  await db.query(`
    DEFINE TABLE IF NOT EXISTS agent SCHEMALESS;
    DEFINE FIELD IF NOT EXISTS name ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS description ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS objective ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS status ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS lifecycle ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS trust_score ON agent TYPE number;
    DEFINE FIELD IF NOT EXISTS runtime_mode ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS approvals ON agent TYPE string;
    DEFINE FIELD IF NOT EXISTS owner ON agent FLEXIBLE TYPE object;
    DEFINE FIELD IF NOT EXISTS skills ON agent TYPE array<string>;
    DEFINE FIELD IF NOT EXISTS tools ON agent TYPE array<string>;
    DEFINE FIELD IF NOT EXISTS policies ON agent TYPE array<string>;
    DEFINE FIELD IF NOT EXISTS constraints ON agent FLEXIBLE TYPE object;
    DEFINE FIELD IF NOT EXISTS kubernetes ON agent FLEXIBLE TYPE object;
    DEFINE FIELD IF NOT EXISTS updated_at ON agent TYPE datetime;
  `);
}

async function patchStatus(agent, phase, surrealRecord, message = '') {
  const namespace = agent.metadata.namespace;
  const name = agent.metadata.name;

  const body = {
    status: {
      phase,
      observedGeneration: agent.metadata.generation || 0,
      surrealRecord,
      message,
      lastReconciledAt: new Date().toISOString(),
    },
  };

  try {
    await customObjectsApi.patchNamespacedCustomObjectStatus({
      group: GROUP,
      version: VERSION,
      namespace,
      plural: PLURAL,
      name,
      body,
    });
  } catch (error) {
    console.error('status patch failed', namespace, name, error.body || error.message);
  }
}

async function reconcile(agent) {
  const namespace = agent.metadata.namespace;
  const name = agent.metadata.name;
  const recordId = `agent:${toRecordId(name)}`;
  const data = agentToSurreal(agent);

  console.log(`Reconciling ${namespace}/${name} -> ${recordId}`);

  try {
    await db.merge(recordId, data);
    await patchStatus(agent, 'Reconciled', recordId);
    console.log(`Reconciled ${namespace}/${name}`);
  } catch (error) {
    console.error(`Reconcile failed for ${namespace}/${name}`, error);
    await patchStatus(agent, 'Failed', recordId, String(error.message || error));
  }
}

async function remove(agent) {
  const name = agent.metadata.name;
  const recordId = `agent:${toRecordId(name)}`;
  console.log(`Deleting ${recordId}`);
  try {
    await db.delete(recordId);
  } catch (error) {
    console.error(`Delete failed for ${recordId}`, error);
  }
}

async function listExisting() {
  const response = await customObjectsApi.listClusterCustomObject({
    group: GROUP,
    version: VERSION,
    plural: PLURAL,
  });

  const items = response.body?.items || response.items || [];
  for (const item of items) {
    await reconcile(item);
  }
}

async function startWatch() {
  await watch.watch(
    `/apis/${GROUP}/${VERSION}/${PLURAL}`,
    {},
    async (type, object) => {
      if (!object?.metadata?.name) return;

      if (type === 'ADDED' || type === 'MODIFIED') {
        await reconcile(object);
      }

      if (type === 'DELETED') {
        await remove(object);
      }
    },
    (error) => {
      if (error) {
        console.error('watch error', error);
      }
      setTimeout(startWatch, 5000);
    },
  );
}

async function main() {
  console.log('Starting Fabric Agent Reconciler');
  console.log(`SurrealDB endpoint: ${SURREAL_ENDPOINT}`);

  await db.connect(SURREAL_ENDPOINT, {
    auth: {
      username: SURREAL_USER,
      password: SURREAL_PASS,
    },
    namespace: SURREAL_NS,
    database: SURREAL_DB,
  });

  await ensureSchema();
  await listExisting();
  await startWatch();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
