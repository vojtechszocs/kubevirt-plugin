import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

enum VMQueries {
  CPU_USAGE = 'CPU_USAGE',
  CPU_REQUESTED = 'CPU_REQUESTED',
  MEMORY_USAGE = 'MEMORY_USAGE',
  FILESYSTEM_USAGE = 'FILESYSTEM_USAGE',
  FILESYSTEM_READ_USAGE = 'FILESYSTEM_READ_USAGE',
  FILESYSTEM_WRITE_USAGE = 'FILESYSTEM_WRITE_USAGE',
  NETWORK_USAGE = 'NETWORK_USAGE',
  NETWORK_IN_USAGE = 'NETWORK_IN_USAGE',
  NETWORK_OUT_USAGE = 'NETWORK_OUT_USAGE',
}

export const getUtilizationQueries = (
  obj: K8sResourceCommon,
  duration: string,
  launcherPodName?: string,
) => {
  const { name, namespace } = obj?.metadata || {};
  return {
    [VMQueries.CPU_USAGE]: `sum(rate(container_cpu_usage_seconds_total{pod='${launcherPodName}',namespace='${namespace}',container="compute"}[${duration}])) BY (pod, namespace)`,
    [VMQueries.CPU_REQUESTED]: `sum(kube_pod_resource_request{resource='cpu',pod='${launcherPodName}',namespace='${namespace}'}) BY (name, namespace)`,
    [VMQueries.MEMORY_USAGE]: `sum(kubevirt_vmi_memory_used_bytes{name='${name}',namespace='${namespace}'}) BY (name)`,
    [VMQueries.NETWORK_IN_USAGE]: `sum(rate(kubevirt_vmi_network_receive_bytes_total{name='${name}',namespace='${namespace}'}[${duration}])) BY (name, namespace)`,
    [VMQueries.NETWORK_OUT_USAGE]: `sum(rate(kubevirt_vmi_network_transmit_bytes_total{name='${name}',namespace='${namespace}'}[${duration}])) BY (name, namespace)`,
    [VMQueries.FILESYSTEM_READ_USAGE]: `sum(rate(kubevirt_vmi_storage_read_traffic_bytes_total{name='${name}',namespace='${namespace}'}[${duration}])) BY (name, namespace)`,
    [VMQueries.FILESYSTEM_WRITE_USAGE]: `sum(rate(kubevirt_vmi_storage_write_traffic_bytes_total{name='${name}',namespace='${namespace}'}[${duration}])) BY (name, namespace)`,
  };
};
