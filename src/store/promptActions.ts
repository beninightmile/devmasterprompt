
import { createSectionActions } from './actions/sectionActions';
import { createReorderActions } from './actions/reorderActions';
import { createInitActions } from './actions/initActions';

export const createPromptActions = (set: any, get: any) => {
  const sectionActions = createSectionActions(set, get);
  const reorderActions = createReorderActions(set);
  const initActions = createInitActions(set);

  return {
    ...sectionActions,
    ...reorderActions,
    ...initActions
  };
};
