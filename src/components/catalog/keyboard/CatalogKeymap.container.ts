import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymap from './Catalogkeymap';
import {
  catalogActionsThunk,
  CatalogAppActions,
  CatalogKeyboardActions,
} from '../../../actions/catalog.action';
import { storageActionsThunk } from '../../../actions/storage.action';
import { AbstractKeymapData } from '../../../services/storage/Storage';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    keyboardDefinition: state.entities.keyboardDefinition,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    keymaps: state.catalog.keyboard.keymaps,
    selectedLayer: state.catalog.keyboard.selectedLayer,
    langLabel: state.catalog.keyboard.langLabel,
  };
};
export type CatalogKeymapStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    goToIntroduction: () => {
      _dispatch(CatalogAppActions.updatePhase('introduction'));
    },
    goToSearch: () => {
      _dispatch(storageActionsThunk.searchKeyboardsForCatalog());
    },
    updateSelectedLayer: (layer: number) => {
      _dispatch(CatalogKeyboardActions.updateSelectedLayer(layer));
    },
    applySharedKeymapData: (savedKeymapData: AbstractKeymapData) => {
      _dispatch(catalogActionsThunk.applySharedKeymapData(savedKeymapData));
    },
  };
};
export type CatalogKeymapActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogKeymap);
