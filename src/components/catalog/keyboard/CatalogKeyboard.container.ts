import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeyboard from './CatalogKeyboard';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    phase: state.catalog.app.phase,
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type CatalogKeyboardStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type CatalogKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogKeyboard);
