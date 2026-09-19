---
title: LIGO and black hole merger noise
subtitle: How far do the mirrors actually move, and how does that compare with the seismic, thermal and quantum noise trying to drown it out?
date: 2023-11-26
tags: ["gravitational waves", "order of magnitude", "problem set"]
image: images/posts/ligo-schematic.jpg
---

{% img "images/posts/ligo-schematic.jpg", "Schematic diagram of the LIGO interferometer and gravitational waves from a binary black hole merger", "Schematic of the LIGO project, and a visual of the gravitational waves produced by a binary black hole merger. Credit: LIGO/MIT." %}

The Laser Interferometer Gravitational-Wave Observatory (LIGO) is a large-scale
physics experiment built to detect cosmic gravitational waves. One of the main
sources of those waves is black hole mergers, which produce ripples in spacetime
that propagate over enormous distances. Detecting them naturally demands
extraordinarily precise measurement.

In operation, the detectors are affected by various background noises that can
move the optical components and mimic a real gravitational wave signal. Much of
the sophistication of the instrument lies in suppressing those unwanted mirror
movements.

This post is set up as a problem first, with my worked solutions below. If you
want to try it yourself, stop at the end of the next section.

## The problem

Calculate the displacement and the variation in relative phase of LIGO's laser
beams during a black hole merger.

Then investigate the main sources of noise in the measurement and compare them,
in order of magnitude, against that signal:

1. **Seismic activity** — vibrations from earthquakes, or even nearby traffic
2. **Thermal noise** — heat causes the atoms in the mirrors to move randomly
3. **Quantum noise** — the properties of photons are inherently uncertain

### Hints and given quantities

**LIGO geometry.** LIGO consists of two interferometers thousands of kilometres
apart, each with two arms of length $L = 4$ km in an L-shape. A laser beam is
split, sent down both arms, and reflected back to the detector. A passing
gravitational wave changes the arm lengths slightly, which shows up as a change
in the interference pattern.

| Quantity | Value |
| --- | --- |
| Arm length $L$ | 4 km |
| Laser frequency $\nu$ | $\sim 10^{14}$ Hz |
| Laser power $P$ | $\sim 40$ W |
| Strain amplitude $h$ of a typical binary black hole merger | $\sim 10^{-22}$ |
| Seismic noise | $\sim 1$ Hz, amplitude $\sim 1\ \mu\mathrm{m}$ |
| Mirror temperature | Room temperature ($\approx 300$ K) |
| Mirror spring constant $k$ | $\sim 10^{11}\ \mathrm{N\,m^{-1}}$ |

For convenience, take the gravitational wave frequency to be much smaller than
$1/T$, where $T$ is the light travel time between the interferometer mirrors.

{% img "images/posts/gw-plus-polarization.gif", "Spatial distortion caused by a plus-polarized gravitational wave", "Spatial distortion caused by a laterally polarised gravitational wave" %}

For a planar gravitational wave of amplitude $h$, the separation between two
points along $\hat{y}$ varies as

$$
\Delta y' = \Delta y \left(1 + \tfrac{1}{2} h \right)
$$

to first order in $h$.

---

<details>
<summary><strong>Show the solutions</strong></summary>

## Section 1: displacement and relative phase

Because $f \ll 1/T$ for the gravitational wave, the spacetime metric can be
treated as constant over the distance scale relevant here.

To make life easier, assume the plane wave is polarised to produce maximum
displacement: it stretches one arm while contracting the other in each cycle, so
the *differential* arm length change is twice the change in a single arm. This
is exactly what the animation above shows.

The strain on each arm is $h/2$, so the differential length change is

$$
\Delta L = h L = 10^{-22} \times 4\times10^{3}\ \mathrm{m}
= 4\times10^{-19}\ \mathrm{m}
$$

which is about a thousandth of the diameter of a proton.

Converting that to a phase difference — with
$\lambda = c/\nu = 3\times10^{8} / 10^{14} = 3\times10^{-6}$ m:

$$
\Delta \phi = \frac{2\pi \, \Delta L}{\lambda}
= \frac{2\pi \times 4\times10^{-19}}{3\times10^{-6}}
\approx 8\times10^{-13}\ \mathrm{rad}
$$

## Section 2: measurement noise

**Seismic noise.** Given directly as an amplitude of $\sim 1\ \mu\mathrm{m}$ at $\sim 1$
Hz. Comparing to the signal:

$$
\frac{10^{-6}}{4\times10^{-19}} \approx 2\times10^{12}
$$

Ground motion is therefore about **twelve orders of magnitude** larger than the
signal. This is why LIGO's mirrors hang from multi-stage pendulum suspensions.

**Thermal noise.** Set the thermal energy of the mirror equal to its elastic
spring energy, $\tfrac{1}{2}k\langle x^2\rangle = \tfrac{1}{2}k_B T$:

$$
x_{\rm rms} = \sqrt{\frac{k_B T}{k}}
= \sqrt{\frac{1.38\times10^{-23} \times 300}{10^{11}}}
\approx 2\times10^{-16}\ \mathrm{m}
$$

about **500 times** the signal — smaller than the seismic term, but still well
above what we are trying to measure.

**Quantum noise.** Quantum noise arises from the uncertainty principle: the
position and momentum of the mirror cannot both be known exactly. Estimate the
momentum delivered by the laser over one second from the energy–momentum
relation, $p \approx Pt/c$:

$$
p \approx \frac{40\ \mathrm{W} \times 1\ \mathrm{s}}{3\times10^{8}\ \mathrm{m\,s^{-1}}}
\approx 1.3\times10^{-7}\ \mathrm{kg\,m\,s^{-1}}
$$

$$
\Delta x \gtrsim \frac{\hbar}{p}
= \frac{1.05\times10^{-34}}{1.3\times10^{-7}}
\approx 8\times10^{-28}\ \mathrm{m}
$$

roughly **nine orders of magnitude below** the signal, so at this level of
estimate quantum noise on the mirror position is negligible. In the real
instrument the quantum limit is set by photon shot noise in the readout rather
than by mirror position uncertainty, which is a much more serious constraint
than this estimate suggests.

### Summary

| Source | Displacement | Relative to the signal |
| --- | --- | --- |
| Gravitational wave signal | $4\times10^{-19}$ m | 1 |
| Seismic | $10^{-6}$ m | $\sim 10^{12}$ |
| Thermal | $2\times10^{-16}$ m | $\sim 10^{3}$ |
| Quantum (mirror position) | $8\times10^{-28}$ m | $\sim 10^{-9}$ |

</details>

---

## Conclusion and reflection

It is remarkable that a series of simple physical assumptions gets you within
range of how different noise sources affect an instrument like LIGO.

The caveat is that these estimates carry large margins of error. The mirrors are
by no means perfectly reflecting, and modelling them is definitively more
complicated than setting thermal energy equal to a spring potential. Seismic
amplitudes also vary with frequency, and LIGO can only fully suppress them in
certain bands. In the end every noise estimate has to be verified
experimentally and calibrated against the signal in question.

Still, the exercise shows that seismic, thermal and quantum noise sit at wildly
different levels relative to the signal, and that two of the three would bury a
binary black hole merger outright. By combining data from multiple detectors and
applying sophisticated analysis, LIGO extracts the signal anyway — which says
a great deal about both the precision of the instrument and the difficulty of
the measurement.

## Citations

1. [LIGO — Squeezed vacuum states](https://www.ligo.org/science/Publication-SqueezedVacuum/index.php)
2. [USGS Open-File Report 93-322](https://pubs.usgs.gov/of/1993/0322/ofr93-322.pdf)
3. [GW170817 — *Phys. Rev. Lett.* 119, 161101](https://journals.aps.org/prl/pdf/10.1103/PhysRevLett.119.161101)
4. [arXiv:1908.11170](https://arxiv.org/pdf/1908.11170.pdf)
5. [*Class. Quantum Grav.* 19, 883](https://iopscience.iop.org/article/10.1088/0264-9381/19/5/305/pdf)
6. [LIGO's interferometer](https://www.ligo.caltech.edu/page/ligos-ifo)
