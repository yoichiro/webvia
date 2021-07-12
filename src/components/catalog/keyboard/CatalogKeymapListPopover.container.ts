import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymapListPopover from './CatalogKeymapListPopover';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    sharedKeymaps: state.entities.sharedKeymaps,
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type CatalogKeymapListPopoverStateType = ReturnType<
  typeof mapStateToProps
>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type CatalogKeymapListPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogKeymapListPopover);
