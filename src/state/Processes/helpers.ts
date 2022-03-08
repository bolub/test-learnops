import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { PROJECT_STAGE_FIELDS } from 'utils/constants';
import { ProjectProcessStage } from 'utils/customTypes';

export const compareProcessStages = (
  originalStages: ProjectProcessStage[],
  updatedStages: ProjectProcessStage[]
) => {
  const stagesToBeDeleted: ProjectProcessStage[] = cloneDeep(originalStages);
  const stagesToBeAdded: ProjectProcessStage[] = [];
  const stagesToBeUpdated: ProjectProcessStage[] = [];
  for (const stage of updatedStages) {
    const foundIndex = stagesToBeDeleted.findIndex(
      (stg: ProjectProcessStage) => stg.id === stage.id
    );
    if (foundIndex > -1) {
      const stageToUpdate = stagesToBeDeleted.splice(foundIndex, 1);
      if (!isEqual(stage, stageToUpdate[0])) {
        stagesToBeUpdated.push(stage);
      }
    } else {
      stagesToBeAdded.push(stage);
    }
  }
  return { stagesToBeAdded, stagesToBeDeleted, stagesToBeUpdated };
};

export const calculateEstimatedProcessCompletionTime = (
  processStages: ProjectProcessStage[]
) => {
  let minTime = 0;
  let maxTime = 0;
  for (const stage of processStages) {
    minTime += +get(
      stage,
      `${PROJECT_STAGE_FIELDS.DATA}.${PROJECT_STAGE_FIELDS.MIN_COMPLETION_TIME}`,
      0
    );
    maxTime += +get(
      stage,
      `${PROJECT_STAGE_FIELDS.DATA}.${PROJECT_STAGE_FIELDS.MAX_COMPLETON_TIME}`,
      0
    );
  }
  return minTime > 0 && maxTime > 0 ? `${minTime} - ${maxTime}` : '';
};
