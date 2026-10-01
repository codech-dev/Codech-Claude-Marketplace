import React from 'react';
import {Composition} from 'remotion';
import {FILM_LEN, Film} from './Film';
import {PhoneHero} from './Scenes';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Film" component={Film} durationInFrames={Math.round(FILM_LEN * 30)} fps={30} width={1920} height={1080} />
    {/* a single scene as its own composition: iterate on one beat without rendering the film */}
    <Composition id="Scene" component={PhoneHero} durationInFrames={150} fps={30} width={1920} height={1080} />
  </>
);
