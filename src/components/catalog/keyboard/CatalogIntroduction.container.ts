import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogIntroduction from './CatalogIntroduction';
import { CatalogAppActions } from '../../../actions/catalog.action';
import { storageActionsThunk } from '../../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type CatalogIntroductionStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    goToKeymap: () => {
      _dispatch(CatalogAppActions.updatePhase('keymap'));
    },
    goToSearch: () => {
      _dispatch(storageActionsThunk.searchKeyboardsForCatalog());
    },
  };
};
export type CatalogIntroductionActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogIntroduction);
