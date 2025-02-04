/********************************************************************************
 * Copyright (c) 2021-2023 EclipseSource and others.
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
import { injectable } from 'inversify';
import { SModelElement, SModelRegistry } from '~glsp-sprotty';

@injectable()
export class GLSPModelRegistry extends SModelRegistry {
    override register(key: string, factory: (u: void) => SModelElement): void {
        if (key === undefined) {
            throw new Error('Key is undefined');
        }
        if (this.hasKey(key)) {
            // do not throw error but log overwriting
            console.log(`Factory for model element '${key}' will be overwritten.`);
        }
        this.elements.set(key, factory);
    }
}
