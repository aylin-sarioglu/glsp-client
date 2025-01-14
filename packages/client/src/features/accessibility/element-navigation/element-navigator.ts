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

import { SModelElement, SModelRoot } from '~glsp-sprotty';
import { SelectableBoundsAware } from '../../../utils/smodel-util';

export interface ElementNavigator {
    previous(
        root: Readonly<SModelRoot>,
        current: SelectableBoundsAware,
        previousCurrent?: SelectableBoundsAware,
        predicate?: (element: SModelElement) => boolean
    ): SModelElement | undefined;

    next(
        root: Readonly<SModelRoot>,
        current: SelectableBoundsAware,
        previousCurrent?: SelectableBoundsAware,
        predicate?: (element: SModelElement) => boolean
    ): SModelElement | undefined;

    up?(
        root: Readonly<SModelRoot>,
        current: SelectableBoundsAware,
        previousCurrent?: SelectableBoundsAware,
        predicate?: (element: SModelElement) => boolean
    ): SModelElement | undefined;

    down?(
        root: Readonly<SModelRoot>,
        current: SelectableBoundsAware,
        previousCurrent?: SelectableBoundsAware,
        predicate?: (element: SModelElement) => boolean
    ): SModelElement | undefined;

    process?(
        root: Readonly<SModelRoot>,
        current: SelectableBoundsAware,
        target: SelectableBoundsAware,
        previousCurrent?: SelectableBoundsAware,
        predicate?: (element: SModelElement) => boolean
    ): void;
    clean?(root: Readonly<SModelRoot>, current?: SelectableBoundsAware, previousCurrent?: SelectableBoundsAware): void;
}
