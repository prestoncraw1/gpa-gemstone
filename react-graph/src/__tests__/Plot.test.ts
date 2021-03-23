import {Plot} from '../index';
import {PointNode} from '../PointNode';

test('Node Min-Max', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1,3);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});

test('Node Min-Max w Limits 1', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const lim = node.GetLimits(-1,2.5);
  expect(lim[0]).toBe(1);
  expect(lim[1]).toBe(2);
});

test('Node Data', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat =node.GetFullData();
  expect(dat.length).toBe(4);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[3][0]).toBe(3);
  expect(dat[3][1]).toBe(3);
});

test('Node Data w limits 1', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat =node.GetData(-1,4);
  expect(dat.length).toBe(4);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[3][0]).toBe(3);
  expect(dat[3][1]).toBe(3);
});

test('Node Data w limits 2', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat =node.GetData(-1,2.5);
  expect(dat.length).toBe(3);
  expect(dat[0][0]).toBe(0);
  expect(dat[0][1]).toBe(1);
  expect(dat[2][0]).toBe(2);
  expect(dat[2][1]).toBe(1);
});

test('Node Get Point', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(2);
  expect(dat[0]).toBe(2);
  expect(dat[1]).toBe(1);
});

test('Node Get Point 2', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(2.4);
  expect(dat[0]).toBe(2);
  expect(dat[1]).toBe(1);
});


test('Node Get Point 3', () => {
  const d: [number,number][] = [[0,1],[1,2],[2,1],[3,3]];
  const node = new PointNode(d);
  const dat = node.GetPoint(4);
  expect(dat[0]).toBe(3);
  expect(dat[1]).toBe(3);
});
