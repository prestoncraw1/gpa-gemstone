﻿// ******************************************************************************************************
//  PointNode.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

const MaxPoints = 20;

/**
 * 
 * Node in a tree.
 */
export class PointNode {
    minT: number;
    maxT: number;
    minY: number;
    maxY: number;
    avgY: number;

    private children: PointNode[] | null;
    private points: [number,number][] | null;

    constructor(data: [number,number][]) {
        // That minimum time stamp that fits in this bucket
        this.minT = data[0][0];
        // The maximum time stamp that might fit in this bucket
        this.maxT = data[data.length - 1][0];
        this.avgY = 0;
        this.children = null;
        this.points = null;

        if (data.length <= MaxPoints) {
            this.points = data;
            this.minY = Math.min(...data.filter(pt => !isNaN(pt[1])).map(pt => pt[1]));
            this.maxY = Math.max(...data.filter(pt => !isNaN(pt[1])).map(pt => pt[1]));
            this.avgY = 0;
            return;
        }

        const nLevel = Math.floor(Math.pow(data.length, 1 / MaxPoints));
        const blockSize = nLevel * MaxPoints;

        let index = 0;
        this.children = [];
        while (index < data.length) {
            this.children.push(new PointNode(data.slice(index, index + blockSize)));
            index = index + blockSize;
        }

        this.avgY = 0;
        this.maxY = Math.max(...this.children.map(node => node.maxY));
        this.minY = Math.min(...this.children.map(node => node.minY));
    }

    public GetData(Tstart: number, Tend: number): [number,number][] {
        if (this.points != null && Tstart <= this.minT && Tend >= this.maxT)
            return this.points;
        if (this.points != null)
            return this.points.filter(pt => pt[0] >= Tstart && pt[1] <= Tend);

        const result: [number,number][] = [];
        return result.concat(...this.children!.filter(node => Tstart <= node.minT && Tend >= node.maxT).map(node => node.GetData(Tstart, Tend)));
    }

    public GetFullData(): [number,number][] {
      return this.GetData(this.minT,this.maxT);
    }

    public GetLimits(Tstart: number, Tend: number): [number,number] {
      let max = this.maxY;
      let min = this.minY;

      if (this.points == null && !(Tstart <= this.minT && Tend > this.maxT)) {
        const limits = this.children!.filter(n => n.maxT > Tstart && n.minT < Tend).map(n => n.GetLimits(Tstart,Tend));
        min = Math.min(...limits.map(pt => pt[0]));
        max = Math.max(...limits.map(pt => pt[1]));
      }
      if (this.points != null && !(Tstart <= this.minT && Tend > this.maxT)) {
        const limits = this.points!.filter(pt => pt[0] > Tstart && pt[0] < Tend).map(pt => pt[1]);
        min = Math.min(...limits);
        max = Math.max(...limits);
      }

      return [min,max];
    }

    /**
     * Retrieves a point from the PointNode tree
     * @param {number} point - The point to retrieve from the tree
     */
    public GetPoint(point: number): [number, number] {
        // round point back to whole integer 
        point = Math.round(point)

        // if the point is less than the minimum value of the subsection, return the first point
        if (point < this.minT && this.points !== null)
            return this.points[0];

        // if the point is greater than the largest value of the subsection, return the last point
        if (point > this.maxT && this.points !== null)
          return this.points[this.points.length - 1];

        // if the subsection is null, and the point is less than the minimum value of the subsection, ??Start over again lookign for the point in the first subsection??
        if (point < this.minT && this.points === null)
          return this.children![0].GetPoint(point);
        else if (point > this.maxT && this.points === null)
            return this.children![this.children!.length - 1].GetPoint(point);


        if (this.points != null) {
            let upper = this.points.length - 1;
            let lower = 0;

            let Tlower = this.minT;
            let Tupper = this.maxT;

            while (Tupper !== point && Tlower !== point && upper !== lower && Tupper !== Tlower) {
                const center = Math.round((upper + lower) / 2);
                const Tcenter = this.points[center][0];

                if (center === upper || center === lower)
                    break;
                if (Tcenter <= point)
                    lower = center;
                if (Tcenter > point)
                    upper = center;
                Tupper = this.points[upper][0];
                Tlower = this.points[lower][0];
            }
            if (Math.abs(point - Tlower) < Math.abs(point - Tupper))
                return this.points[lower];

            return this.points[upper];

        }
        else {
            const child = this.children!.find(n => /*n.minT <= point &&*/ n.maxT > point);
            return child!.GetPoint(point);
        }

    }
}
