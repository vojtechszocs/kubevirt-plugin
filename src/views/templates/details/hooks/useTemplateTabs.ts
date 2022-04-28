import * as React from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';

import TemplateDetailsPage from '../tabs/details/TemplateDetailsPage';
import TemplateDisksPage from '../tabs/disks/TemplateDisksPage';
import TemplateNetworkPage from '../tabs/network/TemplateNetworkPage';
import TemplateSchedulingTab from '../tabs/scheduling/TemplateSchedulingTab';
import TemplateYAMLPage from '../tabs/yaml/TemplateYAMLPage';

export const useVirtualMachineTabs = () => {
  const { t } = useKubevirtTranslation();

  const tabs = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: TemplateDetailsPage,
      },
      {
        href: 'scheduling',
        name: t('Scheduling'),
        component: TemplateSchedulingTab,
      },
      {
        href: 'yaml',
        name: 'YAML',
        component: TemplateYAMLPage,
      },
      {
        href: 'network-interfaces',
        name: t('Network Interfaces'),
        component: TemplateNetworkPage,
      },
      {
        href: 'disks',
        name: t('Disks'),
        component: TemplateDisksPage,
      },
    ],
    [t],
  );

  return tabs;
};
