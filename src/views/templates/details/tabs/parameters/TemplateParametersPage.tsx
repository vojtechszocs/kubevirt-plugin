import React, { FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { useImmer } from 'use-immer';

import { TemplateModel, TemplateParameter, V1Template } from '@kubevirt-ui/kubevirt-api/console';
import { isEqualObject } from '@kubevirt-utils/components/NodeSelectorModal/utils/helpers';
import SidebarEditor from '@kubevirt-utils/components/SidebarEditor/SidebarEditor';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import {
  ActionGroup,
  Alert,
  AlertVariant,
  Button,
  Divider,
  Form,
  PageSection,
  Title,
} from '@patternfly/react-core';

import useEditTemplateAccessReview from '../../hooks/useIsTemplateEditable';

import ParameterEditor from './ParameterEditor';

import './template-parameters-page.scss';

type TemplateParametersPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: V1Template;
};

const TemplateParametersPage: FC<TemplateParametersPageProps> = ({ obj: template }) => {
  const [editableTemplate, setEditableTemplate] = useImmer(template);

  useEffect(() => setEditableTemplate(template), [setEditableTemplate, template]);

  const { t } = useKubevirtTranslation();
  const { isTemplateEditable } = useEditTemplateAccessReview(template);
  const history = useHistory();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onParameterChange = (parameter: TemplateParameter) => {
    setEditableTemplate(({ parameters: draftParameters }) => {
      const parameterIndex = draftParameters.findIndex((p) => p.name === parameter.name);
      draftParameters[parameterIndex] = parameter;
    });
  };

  const parameters = editableTemplate.parameters;

  const isSaveDisabled = isEqualObject(template.parameters, parameters);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const onSave: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await k8sUpdate({
        model: TemplateModel,
        data: editableTemplate,
      });
      setSuccess(true);
    } catch (apiError) {
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageSection className="template-parameters-page">
      <SidebarEditor
        resource={editableTemplate}
        onChange={(newTemplate) => setEditableTemplate(newTemplate)}
      >
        <Form className="template-parameters-page__form">
          <Title headingLevel="h2">{t('Parameters')}</Title>

          {parameters.map((parameter, index) => (
            <>
              <ParameterEditor
                key={parameter.name}
                parameter={parameter}
                onChange={onParameterChange}
                isEditDisabled={!isTemplateEditable}
              />
              {index !== parameters.length - 1 && <Divider />}
            </>
          ))}
          {error && (
            <Alert variant={AlertVariant.danger} isInline title={t('Error')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant={AlertVariant.info} isInline title={t('Success')}>
              {t('Parameters successfully edited')}
            </Alert>
          )}
          <ActionGroup className="pf-c-form">
            <Button
              isDisabled={isSaveDisabled}
              type="submit"
              variant="primary"
              onClick={onSave}
              isLoading={loading}
            >
              {t('Save')}
            </Button>
            <Button type="button" variant="secondary" onClick={goBack}>
              {t('Cancel')}
            </Button>
          </ActionGroup>
        </Form>
      </SidebarEditor>
    </PageSection>
  );
};

export default TemplateParametersPage;
