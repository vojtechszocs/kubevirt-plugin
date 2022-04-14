import * as React from 'react';

import { V1VirtualMachineInstance } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  Title,
} from '@patternfly/react-core';
import { LinkIcon } from '@patternfly/react-icons';

import VirtualMachinesInstancesStatus from '../../../../../components/VirtualMachinesInstancesStatus';
import useGuestOS from '../../../../hooks/useGuestOS';

import Annotations from './Annotations/Annotations';
import BootOrder from './BootOrder/BootOrder';
import CreateAt from './CreateAt/CreateAt';
import Description from './Description/Description';
import HardwareDevices from './HadwareDevices/HardwareDevices';
import Hostname from './Hostname/Hostname';
import IP from './IP/IP';
import Labels from './Labels/Labels';
import Name from './Name/Name';
import Namespace from './Namespace/Namespace';
import Node from './Node/Node';
import OperationSystem from './OperationSystem/OperationSystem';
import Owner from './Owner/Owner';
import Pods from './Pods/Pods';
import Timezone from './Timezone/Timezone';
import WorkloadProfile from './WorkloadProfile/WorkloadProfile';

type DetailsProps = {
  vmi: V1VirtualMachineInstance;
  pathname: string;
};

const Details: React.FC<DetailsProps> = ({ vmi, pathname }) => {
  const { t } = useKubevirtTranslation();
  const [guestAgentData] = useGuestOS(vmi);

  return (
    <div>
      <a href={`${pathname}#details`} className="link-icon">
        <LinkIcon size="sm" />
      </a>
      <Title headingLevel="h2" className="co-section-heading">
        {t('Virtual Machine Instance Details')}
      </Title>
      <Grid hasGutter>
        <GridItem span={6}>
          <DescriptionList>
            <DescriptionListGroup>
              <Name name={vmi?.metadata?.name} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <Namespace namespace={vmi?.metadata?.namespace} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <Labels vmi={vmi} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <Annotations vmi={vmi} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <Description vmi={vmi} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <OperationSystem vmi={vmi} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <CreateAt timestamp={vmi?.metadata?.creationTimestamp} />
            </DescriptionListGroup>
            <DescriptionListGroup>
              <Owner
                namespace={vmi?.metadata?.namespace}
                ownerReferences={vmi?.metadata?.ownerReferences}
              />
            </DescriptionListGroup>
          </DescriptionList>
        </GridItem>
        <GridItem span={6}>
          <DescriptionList>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Status')}</DescriptionListTerm>
              <DescriptionListDescription>
                <VirtualMachinesInstancesStatus status={vmi?.status?.phase} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Pod')}</DescriptionListTerm>
              <DescriptionListDescription>
                <Pods vmi={vmi} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Boot Order')}</DescriptionListTerm>
              <DescriptionListDescription>
                <BootOrder
                  disks={vmi?.spec?.domain?.devices?.disks}
                  interfaces={vmi?.spec?.domain?.devices?.interfaces}
                />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('IP Address')}</DescriptionListTerm>
              <DescriptionListDescription>
                <IP vmi={vmi} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Hostname')}</DescriptionListTerm>
              <DescriptionListDescription>
                <Hostname guestAgentData={guestAgentData} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Time Zone')}</DescriptionListTerm>
              <DescriptionListDescription>
                <Timezone guestAgentData={guestAgentData} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Node')}</DescriptionListTerm>
              <DescriptionListDescription>
                <Node nodeName={vmi?.status?.nodeName} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Workload Profile')}</DescriptionListTerm>
              <DescriptionListDescription>
                <WorkloadProfile annotations={vmi?.metadata?.annotations} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('User Credentials')}</DescriptionListTerm>
              <DescriptionListDescription>
                {/* placeholder */}
                <div className="text-muted">{t('SSH service is not available')} </div>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('SSH Access')}</DescriptionListTerm>
              <DescriptionListDescription>
                {/* placeholder */}
                <div className="text-muted">{t('SSH service is not available')} </div>
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t('Hardware devices')}</DescriptionListTerm>
              <DescriptionListDescription>
                <HardwareDevices devices={vmi?.spec?.domain?.devices} />
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </GridItem>
      </Grid>
    </div>
  );
};

export default Details;
