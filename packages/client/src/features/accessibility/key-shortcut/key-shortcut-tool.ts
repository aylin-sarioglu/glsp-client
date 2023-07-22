/********************************************************************************
 * Copyright (c) 2023 Business Informatics Group (TU Wien) and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable } from 'inversify';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { Action, KeyListener, KeyTool, SetUIExtensionVisibilityAction, SModelElement } from '~glsp-sprotty';
import { BaseGLSPTool } from '../../tools/base-glsp-tool';
import { AccessibleKeyShortcut } from './key-shortcut';

@injectable()
export class KeyShortcutTool extends BaseGLSPTool {
    static ID = 'key-shortcut-tool';

    @inject(KeyTool) protected readonly keytool: KeyTool;

    protected shortcutKeyListener = new ShortcutKeyListener();

    get id(): string {
        return KeyShortcutTool.ID;
    }

    enable(): void {
        this.keytool.register(this.shortcutKeyListener);
    }

    override disable(): void {
        this.keytool.deregister(this.shortcutKeyListener);
    }
}

export class ShortcutKeyListener extends KeyListener {
    protected readonly token = Symbol(ShortcutKeyListener.name);
    override keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
        if (this.matchesActivateShortcutHelpKeystroke(event)) {
            return [SetUIExtensionVisibilityAction.create({ extensionId: AccessibleKeyShortcut.ID, visible: true })];
        }
        return [];
    }

    protected matchesActivateShortcutHelpKeystroke(event: KeyboardEvent): boolean {
        return matchesKeystroke(event, 'KeyH', 'alt');
    }
}
