import * as React from 'react';

import { V1Volume } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { Loading } from '@patternfly/quickstarts';
import { Bullseye, Form, FormGroup, TextInput } from '@patternfly/react-core';

import { CloudInitNetworkData, CloudInitUserData } from './utils/cloudinit-utils';
import CloudInitEditor from './CloudInitEditor';
import { CloudinitNetworkForm } from './CloudInitNetworkForm';

type CloudinitFormProps = {
  cloudInitVolume: V1Volume;
  showEditor: boolean;
  userData: CloudInitUserData;
  networkData: CloudInitNetworkData;
  enableNetworkData: boolean;
  updateUserField: (key: keyof CloudInitUserData, value: string) => void;
  updateNetworkField: (key: keyof CloudInitNetworkData, value: string) => void;
  onEditorSave: (yaml: string) => void;
  setEnableNetworkData: (value: boolean) => void;
};
const CloudinitForm: React.FC<CloudinitFormProps> = ({
  cloudInitVolume,
  userData,
  networkData,
  updateUserField,
  updateNetworkField,
  onEditorSave,
  showEditor,
  enableNetworkData,
  setEnableNetworkData,
}) => {
  const { t } = useKubevirtTranslation();

  return (
    <React.Fragment key="cloudinit-editor">
      {showEditor ? (
        <React.Suspense
          fallback={
            <Bullseye>
              <Loading />
            </Bullseye>
          }
        >
          <CloudInitEditor cloudInitVolume={cloudInitVolume} onSave={onEditorSave} />
        </React.Suspense>
      ) : (
        <Form>
          <FormGroup
            label={t('User')}
            fieldId={'cloudinit-user'}
            className="kv-cloudint-advanced-tab--validation-text"
            isRequired
          >
            <TextInput
              type="text"
              id={'cloudinit-user'}
              value={userData?.user || ''}
              onChange={(v) => updateUserField('user', v)}
            />
          </FormGroup>
          <FormGroup
            label={t('Password')}
            fieldId={'cloudinit-password'}
            className="kv-cloudint-advanced-tab--validation-text"
            helperText={t('Please provide password for username.')}
          >
            <TextInput
              type="text"
              id="cloudinit-password"
              value={userData?.password || ''}
              onChange={(v) => updateUserField('password', v)}
            />
          </FormGroup>
          <FormGroup
            label={t('Hostname')}
            fieldId={'cloudinit-hostname'}
            className="kv-cloudint-advanced-tab--validation-text"
            helperText={t('Please provide hostname.')}
          >
            <TextInput
              value={userData?.hostname || ''}
              type="text"
              id={'cloudinit-hostname'}
              onChange={(v) => updateUserField('hostname', v)}
            />
          </FormGroup>
          <CloudinitNetworkForm
            networkData={networkData}
            updateNetworkField={updateNetworkField}
            enableNetworkData={enableNetworkData}
            setEnableNetworkData={setEnableNetworkData}
          />
        </Form>
      )}
    </React.Fragment>
  );
};

export default CloudinitForm;
