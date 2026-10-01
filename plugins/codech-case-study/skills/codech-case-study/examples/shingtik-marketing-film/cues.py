"""ShingTik marketing film cue sheet (231 cues), run by mf_mix.py. Body times come from the scene code; the mappings below turn them into film time."""
H = lambda b: b + 3.35            # body segment 0 (hook)
S1 = lambda b: b + 11.35          # body segment 1 (Meet … CS)
S2 = lambda b: b + 14.35          # body segment 2 (Order Page, ink flip)
S3 = lambda b: b + 24.35          # body segment 3 (portal, results)
PCS = lambda l: 7.65 + l          # inserted: CS problem
SPL = lambda l: 53.2 + l          # inserted: routine vs exceptions
PD = lambda l: 64.05 + l          # inserted: data problem
CAI = lambda l: 70.05 + l         # inserted: custom AI


# ---- opener
q('pop_light', 0.25, -9); q('tick', 0.45, -12); q('pop_light', 0.55, -9)
q('sweep_air', 0.85, -15, pre=W); q('page', 1.05, -18); q('sweep', 1.35, -16, pre=W)
for k in range(3): q('pop', 2.0 + k * 0.18, -9)
q('whoosh_big', 3.05, -10, pre=0.35)
# ---- hook
q('impact_zoom', H(0.05), -6); q('pop_hard', H(0.4), -12); q('pop_hard', H(0.7), -12)
q('sweep_air', H(1.3), -12, pre=W)
for k in range(9): q('tick', H(1.65 + k * 0.07), -20)
for k in range(3): q('notif', H(1.85 + k * 0.22), -12)
for tb in (2.2, 2.4, 2.9, 3.4): q('pop_dry', H(tb), -11)
for k in range(0, 16, 2): q('pop', H(2.1 + k * 0.09), -13)
# ---- CS problem
for k in range(0, 12, 2): q('notif', PCS(0.15 + k * 0.16), -15)
q('tech_slide', PCS(2.6), -13, pre=0.1); q('typing', PCS(3.3), -17, ln=0.75); q('select', PCS(4.0), -13)
q('error', PCS(4.35), -10); q('error', PCS(4.6), -13)
q('sweep', PCS(5.2), -14, pre=W)
for k in range(3): q('pop_hard', PCS(5.45 + k * 0.32), -10); q('sweep2', PCS(5.75 + k * 0.32), -15, pre=0.12)
# ---- return to flood, swirl into the orb, drop on Meet
q('swirl', H(4.3), -11); q('sparkle', H(4.55), -14); q('whoosh_big', H(5.0), -9, pre=0.25)
q('impact_intro', S1(5.42), -9)
# ---- Meet
q('sparkle', S1(5.85), -16); q('typing', S1(6.4), -18, ln=0.55)
for k in range(3): q('sweep2', S1(6.55 + k * 0.15), -16, pre=0.12)
q('tick', S1(6.95), -15); q('confirm', S1(7.7), -14)
for k in range(4): q('pop_light', S1(7.75 + k * 0.22), -10)
q('click', S1(10.45), -8); q('whoosh_big', S1(10.75), -10, pre=0.2); q('impact_zoom', S1(11.05), -9)
# ---- Type
q('typing_phone', S1(11.45), -16, ln=0.55); q('sweep', S1(12.0), -14, pre=0.05)
q('pop', S1(12.05), -10); q('pop', S1(12.85), -10)
q('tech_slide', S1(13.1), -12, pre=0.05)
for k in range(3): q('tick', S1(13.45 + k * 0.18), -13); q('select', S1(13.75 + k * 0.18), -13)
for k in range(3): q('pop_light', S1(14.1 + k * 0.1), -13)
for tb in (14.95, 15.6): q('page', S1(tb), -15)
q('pop_hard', S1(14.9), -8)
q('sweep', S1(16.35), -11, pre=0.1)
# ---- Photo
q('shutter', S1(17.05), -7); q('sweep_air', S1(17.35), -15, pre=0.1)
q('scifi_sweep', S1(18.0), -14); q('scifi_sweep', S1(18.5), -16)
q('confirm', S1(19.3), -12)
for tb in (19.6, 20.2, 20.6): q('pop', S1(tb), -11)
q('sweep2', S1(21.55), -13, pre=0.1)
# ---- Voice
q('pop', S1(22.6), -10); q('sweep_air', S1(22.4), -15, pre=0.1)
q('pop_light', S1(23.8), -11); q('typing', S1(24.0), -18, ln=1.3)
q('tech_ok', S1(25.3), -13); q('pop', S1(25.6), -11)
# ---- colour flip
q('whoosh_big', S1(26.95), -11, pre=0.2)
for k in range(3): q('impact_zoom', S1(27.3 + k * 0.32), -8 - k)
q('sweep', S1(28.55), -14, pre=0.1)
# ---- Booked
q('tech_slide', S1(28.6), -13)
for k in range(3): q('pop_light', S1(29.0 + k * 0.18), -13)
for j in range(4): q('tick', S1(29.4 + j * 0.38), -12)
q('sweep', S1(31.9), -14, pre=0.1)
# ---- Integration
q('pop_hard', S1(32.3), -10)
for k in range(8): q('pop_light', S1(32.55 + k * 0.12), -14)
for k in range(8): q('tick', S1(33.45 + k * 0.16), -20)
q('whoosh_big', S1(37.45), -11, pre=0.15)
# ---- CS takeover
q('pop', S1(38.4), -10); q('pop', S1(38.9), -10); q('notif', S1(39.2), -11)
q('pop_light', S1(39.7), -12); q('click', S1(40.05), -9); q('pop', S1(40.5), -10)
q('sweep', S1(41.85), -12, pre=0.1)
# ---- routine vs exceptions
q('sweep_air', SPL(0.4), -14); q('tech_ok', SPL(1.3), -15); q('sweep', SPL(2.6), -12, pre=0.1)
# ---- Order Page
q('pop', S2(42.3), -10); q('pop', S2(42.7), -10); q('click', S2(43.25), -8)
q('sweep2', S2(43.55), -13); q('pop_light', S2(43.95), -12)
q('tap', S2(44.2), -10); q('pop_hard', S2(44.2), -12); q('sweep_air', S2(44.6), -16)
for k in range(4): q('tap', S2(45.0 + k * 0.12), -12)
q('pop_hard', S2(45.05), -12); q('click', S2(45.75), -8); q('sweep2', S2(46.05), -13)
q('sweep', S2(46.7), -14, pre=0.05); q('pop', S2(46.75), -10); q('confirm', S2(47.3), -12)
q('whoosh_big', S2(48.6), -11, pre=0.15); q('impact_zoom', S2(48.85), -12)
# ---- data problem
for k in range(4): q('pop_dry', PD(0.5 + k * 0.35), -14)
q('sweep', PD(3.0), -14, pre=0.1); q('typing', PD(3.4), -17, ln=0.7)
q('fail', PD(4.5), -14)
# ---- custom AI
q('sparkle', CAI(0.0), -11); q('whoosh_big', CAI(0.05), -12)
for k in range(5): q('pop_light', CAI(0.6 + k * 0.15), -12)
q('whoosh_big', CAI(3.45), -10, pre=0.15)
# ---- portal
q('tech_slide', S3(49.95), -12)
for k in range(4): q('pop_light', S3(51.0 + k * 0.12), -11)
q('notif', S3(52.2), -10); q('sweep', S3(53.75), -13, pre=0.05)
q('typing', S3(54.3), -17, ln=0.7); q('sweep', S3(55.0), -14, pre=0.05)
for k in range(5): q('tick', S3(55.4 + k * 0.13), -12)
q('sweep_air', S3(56.1), -13); q('sweep', S3(57.75), -13, pre=0.05)
for tb in (58.9, 59.4, 59.8, 60.4): q('pop_light', S3(tb), -11)
q('confirm', S3(60.2), -13); q('sweep', S3(61.75), -13, pre=0.05)
q('whoosh_big', S3(62.3), -13, pre=0.1)
for k in range(4): q('pop_light', S3(62.8 + k * 0.15), -12)
q('swirl', S3(65.0), -13)
# ---- results
q('impact_intro', S3(65.75), -9)
for k in range(14): q('tick', S3(66.15 + k * 0.11), -16 - k * 0.3)
for k in range(3): q('pop_hard', S3(67.4 + k * 0.22), -11)
# ---- end card
q('impact_logo', 95.6, -10)
