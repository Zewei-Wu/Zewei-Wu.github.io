---
title: Is ΛCDM finally challenged? A dwarf galaxy perspective
subtitle: Small galaxies, big impacts — the cracks that appear when you zoom in from the cosmic web to individual dwarfs.
date: 2023-11-07
tags: ["dark matter", "cosmology", "dwarf galaxies", "seminar summary"]
image: images/posts/lcdm-timeline.jpg
---

*Originally written up from a UChicago Astro Tuesday seminar in November 2023,
and revised in 2025 alongside a piece I wrote for
[Astrobites](https://astrobites.org/) on the Bullock & Boylan-Kolchin review of
the same subject.*

**Seminar:** Challenges to the ΛCDM Model in Dwarf Galaxies
**Presenter:** Andrey Kravtsov (University of Chicago)
**Series:** UChicago Astro Tuesday
**Review paper:** [Small-Scale Challenges to the ΛCDM Paradigm](https://arxiv.org/abs/1707.04256) — James Bullock & Michael Boylan-Kolchin, *ARA&A*

## Introduction: a theory of everything?

If you took an "Intro to Cosmology" class today, you would likely walk away
thinking we have the universe pretty much figured out. Astronomers have a
"standard model" of Big Bang cosmology, known as ΛCDM (Lambda–Cold Dark
Matter), and it is a remarkably successful model that relies on just a few
ingredients:

1. A cosmological constant, $\Lambda$, associated with **dark energy**
2. **Cold dark matter** — slow-moving matter that does not interact with light
3. Ordinary **baryonic matter**, which makes up you, me and the stars

{% img "images/posts/lcdm-timeline.jpg", "A timeline of the universe according to the ΛCDM model", "A timeline of the universe according to the ΛCDM model (NASA/WMAP Science Team)" %}

The story starts in 1964, when the discovery of the Cosmic Microwave Background
made news around the world. From that point on we generally accepted the
paradigm of a once hot, dense, expanding universe. Later measurements of
structure abundance and the expansion rate spawned a diverse set of models, and
ΛCDM gradually became the leading one — especially after the detection of CMB
anisotropy and of accelerating expansion in the 1990s.

ΛCDM is the result of decades of observational and theoretical work. Its
elegance lies in being the simplest model that reasonably explains all of the
following:

1. The existence and anisotropy of the CMB
2. The distribution of galaxies on large scales
3. Chemical abundance, especially hydrogen and helium in primordial gas
4. The accelerating expansion of the universe

Since then ΛCDM has been an integral foundation of modern astrophysics. Its
basic principles and its predictions for structure formation have gone
unchallenged for decades, despite a dramatic increase in what we can observe.

## Why dwarf galaxies?

When we zoom in from the scale of the entire universe to individual dwarf
galaxies, cracks begin to appear in that foundation.

The reason is simple: to test dark matter, you want to look where it dominates.
Giant spirals like the Milky Way are messy — full of stars, gas and dust that
complicate the picture. Dwarf galaxies are tiny, faint, and held together almost
entirely by dark matter. If ΛCDM is going to break, it will break here.

The systems in question span masses from roughly $10^{3}$ to $10^{11}\,M_\odot$,
which makes them a crucial testing ground.

## 1. Missing satellites

The best-known challenge is the **missing satellites** problem. Run a simulation
of the Milky Way using only dark matter and you get a halo teeming with
thousands of smaller subhalos. Under ΛCDM, we would expect each of those to host
a dwarf galaxy.

The problem is that we don't see thousands — or even hundreds. For a long time
we knew of only around 20 satellites around the Milky Way. Even with modern
surveys discovering ever-fainter galaxies, we remain nowhere near the number
predicted by simulations.

Both Kravtsov and the review paper suggest this may come down to baryon physics
we do not yet understand. A dark matter halo existing does not mean it "lights
up" with stars: processes like reionization or supernova explosions can heat and
blow out the gas from these tiny halos, leaving them invisible to our
telescopes.

## 2. Too big to fail

A related problem, **too big to fail**, concerns the most massive Milky Way
subhalos predicted by ΛCDM. They come out too dense to host the satellites we
actually observe — the brightest dwarfs we see are not sitting in the biggest
predicted halos, even though halos that massive should not have failed to form
stars. Either the Milky Way is a statistical anomaly, or our understanding of
galaxy formation is incomplete.

## 3. The cusp/core problem

This is perhaps the most famous disagreement. In ΛCDM simulations, matter falls
into the centre of a galaxy and piles up, creating a steep density spike known
as a **cusp**. Observations of the rotation curves of dwarf galaxies, however,
suggest the density instead flattens into a constant-density **core**.

{% img "images/posts/cusp-core.png", "Cusp and core dark matter density profiles", "<strong>Figure 1.</strong> Cusp/core dark matter density profiles (Del Popolo & Kroupa 2009). The solid line is the \"cuspy\" profile, where density keeps rising towards the centre; the dashed line is the \"core\" profile, which flattens." %}

The resolution may lie in feedback physics at the galactic centre, which can
heat and scatter mass outward from the core. Others have suggested the observed
effect results from the "burstiness" of star formation, driven by stochastic
processes.

## 4. The "plane" of satellites

If you drop a box of pins, they land in random directions. Similarly, ΛCDM
predicts that satellite galaxies should be distributed randomly around their
host. But around the Milky Way — and around Andromeda — the observed satellites
appear to be aligned in a thin plane, perpendicular to the galactic disk.

This coherent structure is statistically unlikely in pure ΛCDM, and unlike the
others it is not easily explained away by baryon physics. It remains an open
question, though some have argued the "planes" correlate strongly with local
structure in the cosmic web, and that the planes claimed around other galaxies
are not statistically significant.

## Back-of-the-envelope: how many satellites should there be?

**Question.** How many satellite galaxies would we expect around a galaxy like
the Milky Way under ΛCDM?

**Strategy.** ΛCDM predicts that the satellite mass function follows a power
law, $dN/dM \propto M^{\alpha}$, where $N$ is the cumulative number of
satellites per mass bin. Here I take $\alpha \approx -0.5$.

**Estimate.** The Milky Way is about $10^{12}\,M_\odot$. Taking an average
satellite mass of $10^{8}\,M_\odot$ and integrating the mass function from
$10^{2}$ to $10^{8}\,M_\odot$, then assuming all of them are locally visible,
gives $N \approx 2\times10^{4} \times n$, where $n \approx 10^{-2}$ is the
relative abundance of Milky-Way-mass galaxies at $z = 0$. That works out to
roughly **200 satellites**.

**Reflection.** Against a few dozen observed, this rough estimate reproduces the
missing satellites problem directly. Many of the predicted satellites may simply
be too faint to see, or may contain no stars at all. Alternatively, the
discrepancy points at a problem with ΛCDM itself, or with our understanding of
galaxy formation.

## Is the theory broken?

So is it time to throw out our theory of everything? The answer, from both the
talk and the review, is that these challenges are serious but not yet fatal.

Many of the discrepancies might be resolved by better understanding baryonic
physics, and the ways gas, stars and supernovae interact with dark matter.
Alternatively, one can tweak the dark matter particle itself — making it "warm"
rather than "cold", or allowing it to interact with itself. That would resolve
the small-scale discrepancies without touching the large-scale predictions ΛCDM
has excelled at.

Looking forward, telescopes such as the
[Vera C. Rubin Observatory](https://rubinobservatory.org/) and
[Euclid](https://www.esa.int/Science_Exploration/Space_Science/Euclid) will find
fainter dwarfs and measure their densities with far higher precision. Until
then, ΛCDM remains the champion — though it definitely has some explaining to do
on small scales.

## References

1. Bullock, J. S., & Boylan-Kolchin, M. (2017). "Small-Scale Challenges to the ΛCDM Paradigm." *ARA&A*, 55, 343–387. [arXiv:1707.04256](https://arxiv.org/abs/1707.04256)
2. Boylan-Kolchin, M., Bullock, J. S., & Kaplinghat, M. (2011). "Too big to fail? The puzzling darkness of massive Milky Way subhaloes." *MNRAS*, 415, L40. [arXiv:1103.0007](https://arxiv.org/abs/1103.0007)
3. [A solution to too big to fail — AAS Nova](https://aasnova.org/2016/10/03/a-solution-to-too-big-to-fail/)
4. [arXiv:astro-ph/0005260](https://arxiv.org/abs/astro-ph/0005260)
5. [Graphic history of the universe — NASA LAMBDA](https://lambda.gsfc.nasa.gov/education/graphic_history/univ_evol.html)
6. [Dark matter in the Milky Way: a matter of perspective — Astrobites](https://astrobites.org/2017/07/25/dark-matter-in-the-milky-way-a-matter-of-perspective/)
