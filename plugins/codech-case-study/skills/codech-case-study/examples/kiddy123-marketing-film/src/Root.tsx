import React from 'react';
import {Composition} from 'remotion';
import {FILM_LEN, Film, FilmShort, SHORT_LEN} from './Film';
import {FilmV, FilmVShort} from './V';
import {TOpener} from './Town';
import {MapHero, MapProduct, StarsHero, StarsProduct, StudioHero, StudioProduct} from './Concepts';
import {BedtimeHero, BedtimeProduct, PosterHero, PosterProduct, TownHero, TownProduct} from './Concepts2';

const CONCEPTS = {StarsHero, StarsProduct, MapHero, MapProduct, StudioHero, StudioProduct, TownHero, TownProduct, BedtimeHero, BedtimeProduct, PosterHero, PosterProduct};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={Math.round(FILM_LEN * 30)} fps={30} width={1920} height={1080} />
    <Composition id="FilmShort" component={FilmShort} durationInFrames={Math.round(SHORT_LEN * 30)} fps={30} width={1920} height={1080} />
    <Composition id="FilmV" component={FilmV} durationInFrames={Math.round(FILM_LEN * 30)} fps={30} width={1080} height={1920} />
    <Composition id="FilmVShort" component={FilmVShort} durationInFrames={Math.round(SHORT_LEN * 30)} fps={30} width={1080} height={1920} />
    {/* a single scene as its own composition: iterate on one beat without rendering the film */}
    <Composition id="Scene" component={TOpener} durationInFrames={150} fps={30} width={1920} height={1080} />
    {Object.entries(CONCEPTS).map(([id, C]) => <Composition key={id} id={id} component={C} durationInFrames={90} fps={30} width={1920} height={1080} />)}
  </>
);
