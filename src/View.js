import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { distanceInputMsg, timeInputMsg, copyDistanceMsg } from './Update';

const {
  div,
  h1,
  pre,
  label,
  input,
  table,
  tbody,
  thead,
  th,
  tr,
  td
} = hh(h);

const distances = [
  { name: '100m', distance: 100 },
  { name: '200m', distance: 200 },
  { name: '400m', distance: 400 },
  { name: '800m', distance: 800 },
  { name: '1km', distance: 1000 },
  { name: '1,5km', distance: 1500 },
  { name: '1,6km', distance: 1600 },
  { name: '3km', distance: 3000 },
  { name: '5km', distance: 5000 },
  { name: '10km', distance: 10000 },
  { name: '15km', distance: 15000 },
  { name: '20km', distance: 20000 },
  { name: 'Halbmarathon', distance: 21098 },
  { name: 'Marathon', distance: 42195 },
];


function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Pacerechner'),
    fieldSet('Distanz [m]', model.distance, e => dispatch(distanceInputMsg(e.target.value))),
    fieldSet('Zeit [hh:mm:ss]', model.time, e => dispatch(timeInputMsg(e.target.value))),
    tableView(dispatch, model)
  ]);
}

function fieldSet(labelText, inputValue, oninput) {
  return div([
    label({ className: 'db mb1' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value: inputValue,
      oninput
    })
  ]);
}

function parseSeconds(time) {
  const dashCount = (time.match(/:/g) || []).length;
  if (dashCount === 0 && time == parseInt(time)) {
    return time;
  }
  return NaN;
}


function tableView(dispatch, model) {
  if (model.time === '' || model.distance === 0) {
    return div({ className: 'mv2 i black-50' }, 'Bitte ausfüllen');
  }
  return table({ className: 'mv2 w-100 collapse' }, [
    tableHeader,
    distancesBody(dispatch, '', model)
  ]);
}

function distanceRow(dispatch, className, model, distance) {
  const time = calculateTime(distance, model, null);
  return tr({ className }, [
    cell(td, 'pa2 pointer', distance.name, ()=> dispatch(copyDistanceMsg(distance.distance, time))),
    cell(td, 'pa2 tr', time),
  ]);
}

function calculateTime(distance, model) {
  const mPerS = model.distance / parseInt(model.time.split(':').reduce((acc,time) => (60 * acc) + +time));
  const seconds = (distance.distance / mPerS).toFixed(1);
  const date = new Date(null);
  date.setSeconds(seconds, (seconds*1000)%1000);
  const startIndex = calculateStartIndex(seconds);
  const strLength = 10 - (startIndex - 11);
  return date.toISOString().substr(startIndex, strLength);
}

function calculateStartIndex(seconds){
  if (seconds < 10){
    return 18;
  }
  if (seconds < 60){
    return 17;
  }
  if (seconds < 600){
    return 15;
  }
  if (seconds < 3600){
    return 14;
  }
  if (seconds < 36000){
    return 12;
  }
  return 11;
}

function distancesBody(dispatch, className, model) {
  const rows = R.map(
    R.partial(distanceRow, [dispatch, 'stripe-dark', model]),
    distances);
  return tbody({ className }, rows);
}

function cell(tag, className, value, onclick) {
  return tag({ className, onclick }, value);
}

const tableHeader = thead([
  tr([
    cell(th, 'pa2 tl', 'Distanz'),
    cell(th, 'pa2 tr', 'Zeit'),
  ]),
]);

export default view;
