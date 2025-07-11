
import { sectionActions } from './actions/sectionActions';
import { createReorderActions } from './actions/reorderActions';
import { createInitActions } from './actions/initActions';

export const createPromptActions = (set: any, get: any) => {
  const sectionActionsCreated = sectionActions(set, get);
  const reorderActions = createReorderActions(set);
  const initActions = createInitActions(set);

  return {
    ...sectionActionsCreated,
    ...reorderActions,
    ...initActions
  };
};
