import React from 'react';
import {Composition} from 'remotion';
import {FILM_LEN, Film, FilmShort, SHORT_LEN} from './Film';
import {PhoneHero} from './Scenes';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={Math.round(FILM_LEN * 30)} fps={30} width={1920} height={1080} />
    <Composition id="FilmShort" component={FilmShort} durationInFrames={Math.round(SHORT_LEN * 30)} fps={30} width={1920} height={1080} />
    {/* 9:16 Reels (references/social-reels.md): write src/V.tsx (vertical scenes, same local timing) exporting FilmV / FilmVShort, then
    <Composition id="FilmV" component={FilmV} durationInFrames={Math.round(FILM_LEN * 30)} fps={30} width={1080} height={1920} />
    <Composition id="FilmVShort" component={FilmVShort} durationInFrames={Math.round(SHORT_LEN * 30)} fps={30} width={1080} height={1920} /> */}
    {/* a single scene as its own composition: iterate on one beat without rendering the film */}
    <Composition id="Scene" component={PhoneHero} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
