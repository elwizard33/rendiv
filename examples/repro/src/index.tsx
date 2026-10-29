import React from 'react';
import { setRootComponent, Composition, Sequence, Audio, Fill, staticFile, useFrame } from '@rendiv/core';

const Frame = () => <Fill style={{ background: '#123', color: 'white', fontSize: 80 }}>{useFrame()}</Fill>;

// Bug: <Audio> in a <Sequence> without durationInFrames -> atrim duration=Infinity
const OpenSequenceAudio = () => (
  <>
    <Frame />
    <Sequence from={15}><Audio src={staticFile('a.mp3')} /></Sequence>
  </>
);

// Bug: 2 s of audio in a 5 s composition -> -shortest cuts the video to 2 s
const SilentOutro = () => (
  <>
    <Frame />
    <Sequence from={0} durationInFrames={60}><Audio src={staticFile('a.mp3')} /></Sequence>
  </>
);

// Bug: with concurrency 2, frame 1 is rendered by the second tab only,
// so b.mp3 never reaches the mix
const TwoTabs = () => (
  <>
    <Frame />
    <Sequence from={0} durationInFrames={1}><Audio src={staticFile('a.mp3')} /></Sequence>
    <Sequence from={1} durationInFrames={1}><Audio src={staticFile('b.mp3')} /></Sequence>
  </>
);

const Root = () => (
  <>
    <Composition id="OpenSequenceAudio" component={OpenSequenceAudio} durationInFrames={90} fps={30} width={320} height={180} />
    <Composition id="SilentOutro" component={SilentOutro} durationInFrames={150} fps={30} width={320} height={180} />
    <Composition id="TwoTabs" component={TwoTabs} durationInFrames={2} fps={30} width={320} height={180} />
  </>
);

setRootComponent(Root);
