import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymapToolbar from './CatalogKeymapToolbar';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
  };
};
export type CatalogKeymapToolbarStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type CatalogKeymapToolbarActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogKeymapToolbar);
