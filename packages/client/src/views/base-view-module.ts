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
import {
    BindingContext,
    CircularNode,
    CircularNodeView,
    DefaultTypes,
    DiamondNode,
    DiamondNodeView,
    ExpandButtonView,
    FeatureModule,
    ForeignObjectElement,
    ForeignObjectView,
    HtmlRoot,
    HtmlRootView,
    PreRenderedElement,
    PreRenderedView,
    RectangularNode,
    RectangularNodeView,
    SButton,
    SCompartment,
    SCompartmentView,
    SEdge,
    SGraphView,
    SLabel,
    SLabelView,
    SNode,
    SPort,
    SRoutingHandle,
    SRoutingHandleView,
    ShapedPreRenderedElement,
    SvgViewportView,
    ViewportRootElement,
    configureModelElement,
    moveFeature,
    selectFeature
} from '~glsp-sprotty';
import { GIssueMarker } from '../features/validation/issue-marker';
import { GLSPGraph } from '../lib/model';
import { GEdgeView } from './glsp-edge-view';
import { GIssueMarkerView } from './issue-marker-view';
import { RoundedCornerNodeView } from './rounded-corner-view';

export const baseViewModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureDefaultModelElements(context);
});

export function configureDefaultModelElements(context: Pick<BindingContext, 'bind' | 'isBound'>): void {
    // HTML elements
    configureModelElement(context, DefaultTypes.HTML, HtmlRoot, HtmlRootView);

    // generic elements
    configureModelElement(context, DefaultTypes.FOREIGN_OBJECT, ForeignObjectElement, ForeignObjectView, {
        disable: [selectFeature, moveFeature]
    });
    configureModelElement(context, DefaultTypes.PRE_RENDERED, PreRenderedElement, PreRenderedView);
    configureModelElement(context, DefaultTypes.SHAPE_PRE_RENDERED, ShapedPreRenderedElement, PreRenderedView);

    // SVG elements
    configureModelElement(context, DefaultTypes.SVG, ViewportRootElement, SvgViewportView);

    // graph elements
    configureModelElement(context, DefaultTypes.GRAPH, GLSPGraph, SGraphView);
    configureModelElement(context, DefaultTypes.NODE, SNode, RoundedCornerNodeView);
    configureModelElement(context, DefaultTypes.COMPARTMENT, SCompartment, SCompartmentView);
    configureModelElement(context, DefaultTypes.COMPARTMENT_HEADER, SCompartment, SCompartmentView);
    configureModelElement(context, DefaultTypes.EDGE, SEdge, GEdgeView);
    configureModelElement(context, DefaultTypes.PORT, SPort, RectangularNodeView);
    configureModelElement(context, DefaultTypes.ROUTING_POINT, SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, DefaultTypes.VOLATILE_ROUTING_POINT, SRoutingHandle, SRoutingHandleView);
    configureModelElement(context, DefaultTypes.LABEL, SLabel, SLabelView);

    // UI elements
    configureModelElement(context, DefaultTypes.BUTTON_EXPAND, SButton, ExpandButtonView);
    configureModelElement(context, DefaultTypes.ISSUE_MARKER, GIssueMarker, GIssueMarkerView);

    // shapes
    configureModelElement(context, DefaultTypes.NODE_CIRCLE, CircularNode, CircularNodeView);
    configureModelElement(context, DefaultTypes.NODE_DIAMOND, DiamondNode, DiamondNodeView);
    configureModelElement(context, DefaultTypes.NODE_RECTANGLE, RectangularNode, RectangularNodeView);
}
