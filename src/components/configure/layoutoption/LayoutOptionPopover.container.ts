import { connect } from 'react-redux';
import LayoutOptionPopover from './LayoutOptionPopover';
import { RootState } from '../../../store/state';
import { LayoutOptionsActions } from '../../../actions/actions';
import { hidActionsThunk } from '../../../actions/hid.action';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardLayoutOptions: state.entities.keyboardDefinition?.layouts.labels,
    selectedLayoutOptions: state.configure.layoutOptions.selectedOptions,
  };
};
export type LayoutOptionPopoverStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    setLayoutOption: (
      option: number,
      optionChoice: number,
      hidSupport: boolean
    ) => {
      _dispatch(
        LayoutOptionsActions.updateSelectedOption(option, optionChoice)
      );
      if (hidSupport) {
        _dispatch(hidActionsThunk.updateLayoutOptions());
      }
    },
  };
};

export type LayoutOptionPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutOptionPopover);
