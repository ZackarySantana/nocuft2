import type { ControlActions } from "./generated/control-actions";
import type { UnsupportedControlActions } from "./generated/unsupported-control-actions";

export interface Control extends ControlActions {
    readonly unsupported: UnsupportedControlActions;
}

export declare const control: Control;
