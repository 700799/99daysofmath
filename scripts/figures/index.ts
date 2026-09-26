/**
 * The two figure libraries behind one union, so a spec file, the generator,
 * the preview page and the tests all speak of "a figure" and never have to
 * care which module draws it.
 *
 * angleFigures.ts draws what angle problems describe — the standard angle,
 * the unit circle, the transversal, the wave. measureFigures.ts draws the
 * rest of geometry and measurement — the beam with three marks on it, the
 * two triangles a builder calls identical, the box, the net, the line plot.
 */
import { renderAngleFigure, type AngleFigure } from './angleFigures.js';
import { renderMeasureFigure, type MeasureFigure } from './measureFigures.js';

export type { AngleFigure, MeasureFigure };
export type Figure = AngleFigure | MeasureFigure;

const MEASURE_KINDS = new Set([
  'segment', 'congruence', 'solid', 'net', 'logic',
  'circle-eq', 'composite', 'lineplot', 'convert', 'pattern', 'shapes',
]);

export function renderFigure(fig: Figure): { svg: string; alt: string } {
  return MEASURE_KINDS.has(fig.kind)
    ? renderMeasureFigure(fig as MeasureFigure)
    : renderAngleFigure(fig as AngleFigure);
}
