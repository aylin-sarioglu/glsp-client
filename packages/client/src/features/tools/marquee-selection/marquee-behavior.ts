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

import { Bounds, Point, PointToPointLine } from '~glsp-sprotty';
import { DrawMarqueeAction } from './marquee-tool-feedback';

export interface IMarqueeBehavior {
    readonly entireElement: boolean;
    readonly entireEdge: boolean;
}

export class MarqueeUtil {
    protected startPoint: Point;
    protected currentPoint: Point;
    protected marqueeBehavior: IMarqueeBehavior;

    constructor(marqueeBehavior?: IMarqueeBehavior) {
        if (marqueeBehavior) {
            this.marqueeBehavior = marqueeBehavior;
        } else {
            this.marqueeBehavior = { entireElement: false, entireEdge: false };
        }
    }

    updateStartPoint(position: Point): void {
        this.startPoint = position;
    }

    updateCurrentPoint(position: Point): void {
        this.currentPoint = position;
    }

    drawMarqueeAction(): DrawMarqueeAction {
        return DrawMarqueeAction.create({ startPoint: this.startPoint, endPoint: this.currentPoint });
    }

    isEdgePathMarked(path: string | null): boolean {
        if (!path) {
            return false;
        }
        const points = path
            .split(/M|L/)
            .filter(p => p)
            .map(p => {
                const coord = p.split(',');
                return { x: parseInt(coord[0], 10), y: parseInt(coord[1], 10) };
            });
        return this.isEdgeMarked(points);
    }

    isEdgeMarked(points: Point[]): boolean {
        return this.marqueeBehavior.entireEdge ? this.isEntireEdgeMarked(points) : this.isPartOfEdgeMarked(points);
    }

    isNodeMarked(elementBounds: Bounds): boolean {
        const horizontallyIn =
            this.startPoint.x < this.currentPoint.x
                ? this.isElementBetweenXAxis(elementBounds, this.startPoint.x, this.currentPoint.x)
                : this.isElementBetweenXAxis(elementBounds, this.currentPoint.x, this.startPoint.x);
        const verticallyIn =
            this.startPoint.y < this.currentPoint.y
                ? this.isElementBetweenYAxis(elementBounds, this.startPoint.y, this.currentPoint.y)
                : this.isElementBetweenYAxis(elementBounds, this.currentPoint.y, this.startPoint.y);
        return horizontallyIn && verticallyIn;
    }

    protected isEntireEdgeMarked(points: Point[]): boolean {
        for (let i = 0; i < points.length; i++) {
            if (!this.pointInRect(points[i])) {
                return false;
            }
        }
        return true;
    }

    protected isPartOfEdgeMarked(points: Point[]): boolean {
        for (let i = 0; i < points.length - 1; i++) {
            if (this.isLineMarked(points[i], points[i + 1])) {
                return true;
            }
        }
        return false;
    }

    protected isLineMarked(point1: Point, point2: Point): boolean {
        const line = new PointToPointLine(point1, point2);
        return (
            this.pointInRect(point1) ||
            this.pointInRect(point2) ||
            this.lineIntersect(line, this.startPoint, { x: this.startPoint.x, y: this.currentPoint.y }) ||
            this.lineIntersect(line, this.startPoint, { x: this.currentPoint.x, y: this.startPoint.y }) ||
            this.lineIntersect(line, { x: this.currentPoint.x, y: this.startPoint.y }, this.currentPoint) ||
            this.lineIntersect(line, { x: this.startPoint.x, y: this.currentPoint.y }, this.currentPoint)
        );
    }

    protected lineIntersect(line: PointToPointLine, p1: Point, p2: Point): boolean {
        return line.intersection(new PointToPointLine(p1, p2)) !== undefined;
    }

    protected pointInRect(point: Point): boolean {
        const boolX =
            this.startPoint.x <= this.currentPoint.x
                ? this.isBetween(point.x, this.startPoint.x, this.currentPoint.x)
                : this.isBetween(point.x, this.currentPoint.x, this.startPoint.x);
        const boolY =
            this.startPoint.y <= this.currentPoint.y
                ? this.isBetween(point.y, this.startPoint.y, this.currentPoint.y)
                : this.isBetween(point.y, this.currentPoint.y, this.startPoint.y);
        return boolX && boolY;
    }

    protected isElementBetweenXAxis(elementBounds: Bounds, marqueeLeft: number, marqueeRight: number): boolean {
        const leftEdge = this.isBetween(elementBounds.x, marqueeLeft, marqueeRight);
        const rightEdge = this.isBetween(elementBounds.x + elementBounds.width, marqueeLeft, marqueeRight);
        if (this.marqueeBehavior.entireElement) {
            return leftEdge && rightEdge;
        }
        return (
            leftEdge ||
            rightEdge ||
            this.isBetween(marqueeLeft, elementBounds.x, elementBounds.x + elementBounds.width) ||
            this.isBetween(marqueeRight, elementBounds.x, elementBounds.x + elementBounds.width)
        );
    }

    protected isElementBetweenYAxis(elementBounds: Bounds, marqueeTop: number, marqueeBottom: number): boolean {
        const topEdge = this.isBetween(elementBounds.y, marqueeTop, marqueeBottom);
        const bottomEdge = this.isBetween(elementBounds.y + elementBounds.height, marqueeTop, marqueeBottom);
        if (this.marqueeBehavior.entireElement) {
            return topEdge && bottomEdge;
        }
        return (
            topEdge ||
            bottomEdge ||
            this.isBetween(marqueeTop, elementBounds.y, elementBounds.y + elementBounds.height) ||
            this.isBetween(marqueeBottom, elementBounds.y, elementBounds.y + elementBounds.height)
        );
    }

    protected isBetween(x: number, lower: number, upper: number): boolean {
        return lower <= x && x <= upper;
    }
}
