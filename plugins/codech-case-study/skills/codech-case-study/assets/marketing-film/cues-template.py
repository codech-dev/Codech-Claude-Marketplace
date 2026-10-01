"""SFX cue sheet for the template film, run by mf_mix.py from the film root (video/<slug>-marketing/):
  python $SK/scripts/mf_mix.py audio/cues.py --timeline remotion/src/timeline.json --music audio/music_fit.wav --sfx audio/sfx/wav --len <film s> --out audio/final_mix.wav
q(sound, film_time, gain_db, ln=None, pre=0) · at(scene_id, local_t) -> film time · W = whoosh pre-roll.
Read the times off the scene code (each sp()/io() start is a hit). Rules of thumb: a sound on every element that lands,
whooshes pre-rolled into every cut, typing trimmed with ln=, gains -8 (hero hits) to -20 (tick runs)."""
# opener
q('pop_light', at('opener', 0.25), -9); q('pop_light', at('opener', 0.55), -9)
q('sweep_air', at('opener', 0.85), -15, pre=W)
for k in range(3): q('pop', at('opener', 2.0 + k * 0.18), -9)
q('whoosh_big', at('opener', 3.05), -10, pre=0.35)
# problem: one hard hit per strike-through
for k in range(3): q('pop_hard', at('problem', 0.45 + k * 0.32), -10); q('sweep2', at('problem', 0.5 + k * 0.32), -15, pre=0.12)
# orb: the drop lands here (fit the music so its drop downbeat = at('orb', 0.1))
q('impact_intro', at('orb', 0.1), -9); q('sparkle', at('orb', 0.5), -14)
# phone
q('sweep_air', at('phone', 0.0), -14, pre=W); q('typing_phone', at('phone', 0.6), -16, ln=1.1)
q('pop', at('phone', 1.9), -10); q('notif', at('phone', 2.4), -12); q('pop_hard', at('phone', 3.0), -11)
for k in range(2): q('tick', at('phone', 3.3 + k * 0.15), -13)
# colour flip
q('whoosh_big', at('flip', 0.0), -11, pre=0.2)
for k in range(3): q('impact_zoom', at('flip', 0.35 + k * 0.32), -8 - k)
# exploded UI
q('tech_slide', at('ui', 0.0), -12)
for k in range(4): q('pop_light', at('ui', 1.0 + k * 0.18), -11)
for k in range(7): q('tick', at('ui', 1.8 + k * 0.06), -18)
q('click', at('ui', 3.1), -8)
# end card
q('impact_logo', at('end', 1.95), -10)
