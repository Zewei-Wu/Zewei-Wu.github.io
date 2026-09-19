---
title: Patchy reionization and ultra-faint dwarf galaxies
subtitle: A paper summary — why where a dwarf galaxy sits during reionization changes how long it keeps forming stars.
date: 2023-10-22
tags: ["reionization", "dwarf galaxies", "simulations", "paper summary"]
image: images/posts/ufd-pair.jpg
---

{% img "images/posts/ufd-pair.jpg", "An illustration of a massive galaxy and a dwarf companion", "An illustrated massive–dwarf galaxy pair. Note that the spiral features shown here generally do not exist in real UFDs." %}

This post summarises **"The Impact of Patchy Reionization on Ultra-faint Dwarf
Galaxies"** by Kim et al., submitted to
[arXiv:2310.11621](https://arxiv.org/abs/2310.11621).

arXiv drafts can be revised at any time, so this summary refers to the version
posted on 19 October 2023.

## Reionization — the birth certificate of stars

A few hundred million years after the Big Bang, the first stars were born, and
their ultraviolet output began punching ionised holes in their murky
surroundings. As more stars formed with radiation energetic enough to ionise
hydrogen, they transformed the gas clouds around them entirely. This process is
**reionization**: the moment neutral intergalactic matter is ionised by
energetic photons, primarily from stars. It was the second major phase
transition in Big Bang cosmology, after the universe became neutral during
recombination.

As important as reionization is to our picture of the universe, its effect on
galaxies and their evolution is still debated, because the early universe at
$z > 6$ is extremely difficult to observe. Theoretical modelling and simulation
are therefore central to reionization studies. Among galaxies, ultra-faint
dwarfs (UFDs) are probably the most vulnerable to its effects.

Kim et al. investigate the impact of **patchy** reionization on the star
formation history (SFH) and stellar metallicity of these dwarfs. The term
"patchy" is used because reionization almost certainly did not happen uniformly:
regions near the first galaxies would have been ionised first, with more
isolated regions following much later. The authors probe this with cosmological
hydrodynamic zoom-in simulations of analogues to observed UFDs, using a novel
method to model both patchy and homogeneous reionization around their targets.

## Why ultra-faint dwarfs?

Because of their small volume and mass, UFDs are extremely susceptible to both
internal and external feedback. On cosmic scales they are also considered the
fundamental building blocks of massive galaxies, so understanding how they form
and evolve feeds directly into our understanding of the universe as a whole.
Both properties make them an ideal laboratory for reionization physics.

## Modelling "patchiness"

It is well established that reionization can quench star formation by stripping
away the gas required to make new stars, and this shows up prominently in dwarf
galaxy simulations. Previous work, however, typically adopted a uniform
reionization intensity, ignoring the photon field from each UFD's immediate
environment — mainly its host galaxy. Kim's team suspected that adding
patchiness could explain the characteristically long star formation histories
seen in recent observations of UFDs associated with the Magellanic Clouds.

Implementing this is not straightforward. Solving the radiative transfer between
a UFD and its host would demand prohibitive computational resources. The team's
workaround was to **pre-calculate local radiation fields from dark-matter-only
simulations**, then feed that information into the hydrodynamic runs to obtain
the SFH and metallicity of each modelled UFD. This proved far more efficient,
and gave them a handle on the strength of reionization applied to each dwarf —
tunable by the host's UV spectrum, its distance, and a transition redshift at
which the model switches from patchy (PR) to global (GR) reionization.

{% img "images/posts/kim2023-fig6.png", "Cumulative star formation histories under global and patchy reionization", "<strong>Figure 1.</strong> Cumulative star formation histories (top) and maximum hydrogen number density (bottom) for simulated UFDs under global reionization (GR, grey) and patchy reionization (PR, coloured), with the grey band marking the reionization transition. Under GR, star formation stops completely; under PR it continues for an extended period. Halos with extended SFHs retain dense gas, which enables late star formation under the weaker UV field. <em>Figure 6 of Kim et al. (2023).</em>" %}

## How does it compare with observation?

The simulations show that patchy reionization can weaken the effect of
reionization by **two orders of magnitude** out to $z = 3$. That weaker quenching
allows late star formation in some simulated UFDs — around **460 Myr later**
than in the homogeneous case. This is comparable to the observed Magellanic
UFDs, suggesting patchy reionization may be responsible for their extended SFHs
relative to non-Magellanic UFDs. The authors are candid that the simulations do
not fully reproduce the shape of the observed star formation rate curve, and
attribute the residual difference to a milder reionization experienced by the
Magellanic UFDs.

The average stellar iron abundance [Fe/H] of the simulated UFDs also rises by
0.22–0.42 dex under patchy reionization. This follows from a prolonged star
formation history drawing on globally enriched material at late cosmic times,
and is roughly consistent with observed values.

The paper closes by suggesting that the Magellanic UFDs may sit further away
than currently inferred, based on the weaker reionization they appear to have
experienced. More broadly, it makes the case that environmental factors like
patchy reionization matter in cosmological simulations, and can meaningfully
shift both the SFH and the stellar metallicity of UFDs.

## Back-of-the-envelope calculation

The paper reports a weak linear correlation between the transition time and the
duration of late star formation. The transition redshift $z_t$ is where
reionization switches from patchy to global — loosely, when reionization of the
universe concludes. It is usually taken to be around 5.8, which is also the
upper bound Kim et al. adopt. Shifting it from 5.8 to 5.5 extended late star
formation in some halos by $\Delta t_{\rm SF} = 240$ Myr.

**The question:** if that correlation really were linear, and the universe had
not finished reionizing until today ($z_t = 0$), how long would late star
formation last compared with $z_t = 5.8$?

**Approach:** convert each redshift to a cosmic time, then scale
$\Delta t_{\rm SF}$ by the ratio of the time intervals. For the high-redshift
anchors, use the matter-dominated approximation

$$
t(z) \;\approx\; \frac{2}{3\,H_0\,\Omega_m^{1/2}\,(1+z)^{3/2}}
$$

with $H_0 = 71\ \mathrm{km\,s^{-1}\,Mpc^{-1}}$ and $\Omega_m = 0.265$, giving
$t(z) \approx 17.8\,(1+z)^{-3/2}$ Gyr.

| Redshift | Cosmic time |
| --- | --- |
| $z = 5.8$ | 1.01 Gyr |
| $z = 5.5$ | 1.08 Gyr |
| $z = 0$ | 13.8 Gyr |

So a $\Delta t = 70$ Myr delay in the end of reionization buys 240 Myr of extra
star formation — a slope of roughly 3.4 Myr per Myr. Extrapolating all the way
to the present day:

$$
\Delta t_{\rm SF} \;=\; 240\ \mathrm{Myr} \times
\frac{13.8 - 1.01}{1.08 - 1.01} \;\approx\; 4.4\times10^{4}\ \mathrm{Myr}
\;\approx\; 44\ \mathrm{Gyr}
$$

**Conclusion:** 44 Gyr of extended star formation is more than three times the
current age of the universe, which is plainly impossible. The suggested linear
correlation must therefore be either very weak or only locally valid around the
epoch of reionization — unsurprising, given that a 70 Myr shift in $z_t$ already
produced 240 Myr of $\Delta t_{\rm SF}$. The non-linear physics of reionization
and quenching is doing the real work here.

Two caveats on the arithmetic. The matter-dominated formula above is only good at
high redshift; at $z = 0$ it returns 17.8 Gyr rather than the true 13.8 Gyr,
because it ignores dark energy, so I have used the true age for that row.

## References

1. Kim, J., Jeon, M., Choi, Y., Richstein, H., Sacchi, E., & Kallivayalil, N. (2023). "The Impact of Patchy Reionization on Ultra-faint Dwarf Galaxies." [arXiv:2310.11621](https://arxiv.org/abs/2310.11621)
2. Komatsu, E. *et al.* (2011). "Seven-Year WMAP Observations: Cosmological Interpretation." *ApJS*, 192, 18. [doi:10.1088/0067-0049/192/2/18](https://doi.org/10.1088/0067-0049/192/2/18)
3. Planck Collaboration (2016). "Planck 2015 results. XIII. Cosmological parameters." *A&A*, 594, A13. [doi:10.1051/0004-6361/201525830](https://doi.org/10.1051/0004-6361/201525830)
