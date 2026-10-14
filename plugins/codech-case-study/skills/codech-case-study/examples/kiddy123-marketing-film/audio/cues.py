"""SFX cue sheet for the Kiddy123 KiddyMatch AI case-study film (Tiny Town look), run by mf_mix.py from the film root:
  python $SK/scripts/mf_mix.py audio/cues.py --timeline remotion/src/timeline.json --music audio/music_fit.wav --sfx audio/sfx/wav --len 75.87 --out audio/final_mix.wav
q(sound, film_time, gain_db, ln=None, pre=0) · at(scene_id, local_t) -> film time · W = whoosh pre-roll.
Times are read off the scene code (Town.tsx / Chat.tsx / Engine.tsx). Music: Pixabay px590383 (Tatamusic), drop at 14.21 s
= the reveal pin pulse at('reveal', 1.35). Chat sends get a pop, bot answers a notif, cards a hard pop, highlights a select."""


def enter(scene, kind='air', g=-17):
    """Whoosh into each scene's entrance transition (Film.tsx TRANS), peaking as the new scene lands."""
    q({'air': 'sweep_air', 'push': 'sweep2', 'zoom': 'whoosh_big', 'wipe': 'swirl'}[kind], at(scene, 0.0), g, pre=W)


def typing(scene, a, b, g=-19):
    q('typing', at(scene, a), g, ln=b - a)


# ---------------- opener
q('pop', at('opener', 0.2), -12)                                   # Codech logo rises
q('tick', at('opener', 0.7), -18)                                  # eyebrow
q('pop_hard', at('opener', 0.9), -11); q('sweep_air', at('opener', 1.1), -18)   # title + sun marker wipe
q('pop', at('opener', 2.0), -13)                                   # Proposed for Kiddy123
for k in range(3): q('pop_light', at('opener', 2.5 + k * 0.14), -13)   # Match · Answer · Insight
q('whoosh_big', at('opener', 3.95), -11, pre=0.3)                  # zoom-through exit

# ---------------- the challenge
enter('sprawl', 'zoom', -15)
for k in range(15): q('tick', at('sprawl', 0.2 + k * 0.1), -21)    # 15,074 counts up
q('pop_hard', at('sprawl', 0.5), -12); q('tick', at('sprawl', 1.2), -18)

enter('form', 'push')
q('tech_slide', at('form', 0.25), -14); q('pop_hard', at('form', 0.2), -12)
q('scifi_sweep', at('form', 0.6), -21, ln=2.2)                     # the endless result list scrolls
q('error', at('form', 1.5), -18)

enter('demand', 'wipe')
for k, t in enumerate([0.1, 0.45, 0.8, 1.1, 1.35, 1.7]): q('pop_light', at('demand', t), -16 - (k % 2))   # parents' questions rise
q('pop_hard', at('demand', 0.2), -12)

# ---------------- our solution (the drop)
q('swirl', at('reveal', 0.0), -13, pre=0.2)                        # challenges pull into the pin
q('impact_zoom', at('reveal', 1.35), -8); q('sparkle', at('reveal', 1.4), -13)   # pin pulse = music drop
q('pop_hard', at('reveal', 1.5), -11)                              # title
q('pop', at('reveal', 2.4), -13)                                   # Built by Codech · for Kiddy123
for k in range(3): q('pop_light', at('reveal', 2.9 + k * 0.14), -13)
for k, t in enumerate([3.1, 3.3, 3.5]): q('pop', at('reveal', t), -12); q('tick', at('reveal', t + 0.05), -19)   # POI tags

# ---------------- match
enter('find', 'push')
typing('find', 0.35, 1.85)
q('pop', at('find', 1.95), -11)                                    # send
q('tick', at('find', 2.15), -20); q('tick', at('find', 2.45), -20) # typing dots
q('notif', at('find', 2.85), -12)                                  # "Great news!"
q('pop_hard', at('find', 3.3), -11); q('pop_hard', at('find', 3.8), -12)   # school cards
q('sweep_air', at('find', 2.95), -21); q('sweep_air', at('find', 4.3), -21) # chat scrolls

enter('enquire', 'air')
typing('enquire', 0.35, 0.95); typing('enquire', 1.05, 1.7)
q('select', at('enquire', 1.95), -13)                              # PDPA consent ticks
q('click', at('enquire', 2.35), -9)                                # Submit Enquiry
q('confirm', at('enquire', 2.7), -11)                              # toast: Enquiry sent
q('notif', at('enquire', 2.95), -14)                               # Done! 🎉

enter('compare', 'wipe')
q('tech_slide', at('compare', 0.15), -14); q('pop', at('compare', 0.3), -13)
q('tap', at('compare', 0.75), -12); q('pop', at('compare', 1.05), -11)
q('tick', at('compare', 1.3), -20); q('notif', at('compare', 1.85), -12)
for k, t in enumerate([2.0, 2.5, 3.0]): q('select', at('compare', t), -12 - k)   # each pick lights its cell

# ---------------- answer
enter('context', 'zoom', -15)
q('tap', at('context', 0.75), -12); q('pop', at('context', 1.2), -11)
q('tick', at('context', 1.5), -20); q('notif', at('context', 2.15), -12)
q('select', at('context', 2.8), -12); q('pop', at('context', 2.85), -13)   # fee highlight + FROM THE LISTING

enter('chinese', 'push')
q('click', at('chinese', 0.45), -11); q('swirl', at('chinese', 0.47), -18)   # language toggle flips the whole chat
typing('chinese', 0.8, 1.45)
q('pop', at('chinese', 1.55), -11); q('tick', at('chinese', 1.8), -20); q('notif', at('chinese', 2.35), -12)
q('select', at('chinese', 2.9), -13)

enter('guess', 'air')
typing('guess', 0.25, 0.95)
q('pop', at('guess', 1.05), -11); q('tick', at('guess', 1.3), -20)
q('notif', at('guess', 1.85), -12); q('pop_light', at('guess', 2.4), -14)

# ---------------- insight (admin, sample data)
enter('intent', 'wipe')
q('tech_slide', at('intent', 0.05), -14)
for k in range(4): q('pop_light', at('intent', 0.3 + k * 0.08), -15)
q('sweep', at('intent', 0.9), -19)                                 # area bars grow
q('whoosh_big', at('intent', 2.6), -15, pre=0.15); q('impact_zoom', at('intent', 2.75), -13)   # content gaps lift

enter('lost', 'push')
for k in range(4): q('pop_light', at('lost', 0.3 + k * 0.08), -15)
q('sweep', at('lost', 0.9), -19)
q('whoosh_big', at('lost', 2.4), -15, pre=0.15); q('ding', at('lost', 2.6), -14)   # fixable row lifts

enter('sponsor', 'air')
for k in range(4): q('pop_light', at('sponsor', 0.3 + k * 0.08), -15)
for k in range(4): q('tech_ok', at('sponsor', 1.1 + k * 0.35), -15)   # fairness rules tick on

# ---------------- how it works
enter('how', 'zoom', -15)
for k, t in enumerate([0.25, 0.4, 0.55]): q('pop_hard', at('how', t), -13)
for k in range(6): q('pop_light', at('how', 1.05 + k * 0.1), -16)  # need + preference chips
q('scifi_sweep', at('how', 1.5), -17, ln=0.8)                      # pulse path 1
for k in range(12): q('tick', at('how', 1.7 + k * 0.1), -21)       # 15,074 -> 3
q('pop_hard', at('how', 2.9), -11)                                 # lands on 3
q('scifi_sweep', at('how', 3.0), -17, ln=0.8)                      # pulse path 2
q('notif', at('how', 3.2), -13)
q('ding', at('how', 3.6), -13); q('ding', at('how', 3.8), -14)     # checks
q('pop', at('how', 4.1), -13)                                      # enquiries -> WordPress leads

# ---------------- how we delivered
enter('delivered', 'wipe')
for k in range(4): q('sweep2', at('delivered', 0.45 + k * 0.5), -17, pre=0.12); q('pop_hard', at('delivered', 0.5 + k * 0.5), -13)
for k in range(3): q('pop_light', at('delivered', 0.85 + k * 0.5), -15)   # arrows
typing('delivered', 2.0, 2.9, -20)                                 # tools.py types in
q('ding', at('delivered', 2.1), -14)                               # LIVE

# ---------------- results
enter('results', 'zoom', -15)
q('pop_hard', at('results', 0.15), -11)
for s in range(4):
    for k in range(6): q('tick', at('results', 0.5 + s * 0.2 + k * 0.17), -22)
q('pop', at('results', 1.8), -14)

# ---------------- end card (no impact_logo: it is a 7.8 s wind riser)
q('swirl', at('end', 0.0), -15, pre=0.2)
q('impact_zoom', at('end', 1.95), -9); q('sparkle', at('end', 2.0), -13)
for k in range(3): q('pop_light', at('end', 2.95 + k * 0.16), -14)
q('pop', at('end', 3.5), -13)
