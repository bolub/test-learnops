import React from 'react';
import intl from 'react-intl-universal';
import get from 'lodash/get';
import has from 'lodash/has';
import {
  Button,
  Typography,
  FormItem,
  TextArea,
  TextField,
  IconButton,
  NumericInput,
} from '@getsynapse/design-system';
import {
  NewProjectProcess,
  NewProjectProcessStage,
  ProjectProcess,
  ProjectProcessStage,
} from 'utils/customTypes';
import { PROJECT_STAGE_FIELDS, PROJECT_PROCESS_FIELDS } from 'utils/constants';

const ProcessForm: React.FC<{
  process: NewProjectProcess | ProjectProcess;
  updateProcess: (key: string, value: string) => void;
  updateStage: (index: number, key: string, value: string) => void;
  addStage: () => void;
  removeStage: (index: number) => void;
  stagesErrors: number[];
  unremovableStages?: string[];
}> = ({
  process,
  addStage,
  updateProcess,
  removeStage,
  updateStage,
  stagesErrors,
  unremovableStages = [],
}) => {
  const isDefaultProcess = get(process, 'data.createdBySystem', false);
  const hasProcessMultipleStages = process.projectStages.length > 1;
  return (
    <div className='grid gap-x-10 gap-y-4 grid-cols-2'>
      <Typography varian='body' className='col-span-2 text-neutral-black'>
        {intl.get('SETTINGS_PAGE.ADD_PROCESS_MODAL.DESCRIPTION')}
      </Typography>
      <FormItem
        label={intl.get(
          'SETTINGS_PAGE.ADD_PROCESS_MODAL.PROCESS_NAME_FIELD_LABEL'
        )}
        labelProps={{ required: true }}
      >
        <TextArea
          textAreaProps={{
            className: 'max-h-20',
            placeholder: intl.get(
              'SETTINGS_PAGE.ADD_PROCESS_MODAL.PROCESS_NAME_FIELD_PLACEHOLDER'
            ),
            'data-cy': 'process-form__process-name',
          }}
          disabled={isDefaultProcess}
          value={process.processName}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateProcess(
              PROJECT_PROCESS_FIELDS.PROCESS_NAME,
              event.target.value
            )
          }
        />
      </FormItem>
      <FormItem
        label={intl.get(
          'SETTINGS_PAGE.ADD_PROCESS_MODAL.DESCRIPTION_FIELD_LABEL'
        )}
        labelProps={{ required: true }}
      >
        <TextArea
          textAreaProps={{
            className: 'max-h-20',
            placeholder: intl.get(
              'SETTINGS_PAGE.ADD_PROCESS_MODAL.PROCESS_DESCRIPTION_FIELD_PLACEHOLDER'
            ),
            'data-cy': 'process-form__process-description',
          }}
          value={process.description}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateProcess(
              PROJECT_PROCESS_FIELDS.DESCRIPTION,
              event.target.value
            )
          }
        />
      </FormItem>
      {process.projectStages.map(
        (
          stage: NewProjectProcessStage | ProjectProcessStage,
          index: number
        ) => {
          let canRemoveStage = !isDefaultProcess && hasProcessMultipleStages;
          if (canRemoveStage) {
            if (has(process, 'id') && has(stage, 'id')) {
              canRemoveStage = !unremovableStages.includes(get(stage, 'id'));
            }
          }
          return (
            <React.Fragment key={index}>
              <Typography
                className='col-span-2 mt-3.5'
                data-cy='process-form__stage-number'
              >
                {intl.get('SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_DIVISION', {
                  index: index + 1,
                })}
              </Typography>
              <div>
                <FormItem
                  label={intl.get(
                    'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_NAME_FIELD_LABEL'
                  )}
                  labelProps={{ required: true }}
                  className='mb-4'
                  helpText={
                    stagesErrors.includes(index) &&
                    intl.get(
                      'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_NAME_FIELD_ERROR'
                    )
                  }
                  helpTextProps={{
                    state: stagesErrors.includes(index) ? 'error' : 'default',
                  }}
                >
                  <TextField
                    placeholder={intl.get(
                      'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_NAME_FIELD_PLACEHOLDER'
                    )}
                    disabled={isDefaultProcess}
                    value={stage.stageName}
                    state={stagesErrors.includes(index) ? 'error' : 'default'}
                    data-cy={`process-form__stage-${index}__stage-name`}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      updateStage(
                        index,
                        PROJECT_STAGE_FIELDS.STAGE_NAME,
                        event.target.value
                      )
                    }
                  />
                </FormItem>
                <FormItem
                  label={intl.get(
                    'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_COMPLETION_FIELD_LABEL'
                  )}
                >
                  <div className='w-full flex justify-between'>
                    <NumericInput
                      placeholder={intl.get(
                        'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_MIN_COMPLETION_FIELD_PLACEHOLDER'
                      )}
                      data-cy={`process-form__stage-${index}__min-completion-time`}
                      divProps={{ className: 'flex flex-1' }}
                      value={get(
                        stage,
                        `${PROJECT_STAGE_FIELDS.DATA}.${PROJECT_STAGE_FIELDS.MIN_COMPLETION_TIME}`
                      )}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateStage(
                          index,
                          PROJECT_STAGE_FIELDS.MIN_COMPLETION_TIME,
                          event.target.value
                        )
                      }
                    />
                    <div className='mx-2 flex h-10 items-center'> - </div>
                    <NumericInput
                      placeholder={intl.get(
                        'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_MAX_COMPLETION_FIELD_PLACEHOLDER'
                      )}
                      data-cy={`process-form__stage-${index}__max-completion-time`}
                      divProps={{ className: 'flex flex-1' }}
                      value={get(
                        stage,
                        `${PROJECT_STAGE_FIELDS.DATA}.${PROJECT_STAGE_FIELDS.MAX_COMPLETON_TIME}`
                      )}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        updateStage(
                          index,
                          PROJECT_STAGE_FIELDS.MAX_COMPLETON_TIME,
                          event.target.value
                        )
                      }
                    />
                    <div className='ml-2 flex h-10 items-center'>
                      {intl.get('TASKS.TASK_DETAIL_PAGE.HOURS_LABEL')}
                    </div>
                  </div>
                </FormItem>
              </div>
              <div className='w-full flex items-center'>
                <FormItem
                  label={intl.get(
                    'SETTINGS_PAGE.ADD_PROCESS_MODAL.DESCRIPTION_FIELD_LABEL'
                  )}
                  className='flex-1'
                >
                  <TextArea
                    textAreaProps={{
                      className: 'h-30 w-full',
                      placeholder: intl.get(
                        'SETTINGS_PAGE.ADD_PROCESS_MODAL.STAGE_DESCRIPTION_FIELD_PLACEHOLDER'
                      ),
                      'data-cy': `process-form__stage-${index}__stage-description`,
                    }}
                    value={stage.description}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateStage(
                        index,
                        PROJECT_STAGE_FIELDS.DESCRIPTION,
                        event.target.value
                      )
                    }
                  />
                </FormItem>
                {canRemoveStage && (
                  <IconButton
                    name='trash'
                    className='ml-3'
                    onClick={() => removeStage(index)}
                    data-cy={`process-form__stage-${index}__remove-stage-button`}
                  />
                )}
              </div>
            </React.Fragment>
          );
        }
      )}
      <div className='colspan-2 pb-1 pl-1'>
        <Button
          variant='tertiary'
          iconName='add-circle'
          onClick={addStage}
          data-cy='process-form__add-stage-button'
        >
          {intl.get('SETTINGS_PAGE.ADD_PROCESS_MODAL.ADD_STAGE_BUTTON')}
        </Button>
      </div>
    </div>
  );
};

export default ProcessForm;
