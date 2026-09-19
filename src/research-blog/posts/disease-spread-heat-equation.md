---
title: Solving disease spread with the heat equation
subtitle: Two problems that look nothing alike, one differential equation, and an order-of-magnitude answer that survives the comparison.
date: 2023-10-30
tags: ["order of magnitude", "modelling"]
image: images/posts/epidemiology.jpg
---

{% img "images/posts/epidemiology.jpg", "An illustration of an epidemic spreading through a population", "A depiction of an epidemic in a population (UKRI)" %}

Mathematics is a universal language, and it applies to problems that look
completely unrelated at first glance. In this post I want to put two such
problems side by side — the spread of a disease and the diffusion of heat — and
see whether insight from one can solve the other.

## Problem 1: the spread of a disease

After the COVID pandemic, none of us are strangers to epidemiology. One of the
hardest parts of the outbreak was modelling the distribution and pattern of
spread accurately.

Having done some Science Olympiad in high school, I have a little working
knowledge of infectious disease modelling. The most common approach is the
**compartmental model**: sets of differential equations formulated as Markov
chains. Created by W. O. Kermack and A. G. McKendrick in 1927, the SIR model
divides a population into three groups — susceptible ($S$), infected ($I$) and
recovered ($R$) — and the rates at which individuals move between them are

$$
\frac{dS}{dt} = -\frac{\beta I S}{N}, \qquad
\frac{dI}{dt} = \frac{\beta I S}{N} - \gamma I, \qquad
\frac{dR}{dt} = \gamma I
$$

where $N = S + I + R$, $\beta$ is the infection rate and $\gamma$ the recovery
rate.

## Problem 2: the diffusion of heat

The diffusion of heat through a material is also described by a differential
equation — the heat equation:

$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u
$$

where $u$ is temperature, $t$ is time and $\alpha$ is the thermal diffusivity.
The Laplacian $\nabla^2$, a second spatial derivative, is what ties the
temperature gradient to the rate of change in time.

## What the two have in common

At first glance these problems are unrelated: one is public health, the other is
a physical process. But both are described by differential equations involving
rates of change, both are governed by constant rates ($\alpha$, $\beta$,
$\gamma$), and — most importantly — both involve some form of transfer.
Disease moves from person to person in the SIR model; heat moves from point to
point in the heat equation. Mathematically that transfer shows up as a product
term ($\beta I S$) in one case and a second derivative ($\nabla^2 u$) in the
other.

So consider a question about disease:

> How long does it take for an epidemic to spread across a city of a given
> population density?

Just as heat flows from hot regions to cold ones, disease flows from
high-infection regions to low-infection ones. That analogy is enough to get an
estimate.

### Solving the epidemic with the heat equation

Let me flatten an idealised city into a one-dimensional line of length $L$ — I
know, I know. Assume the citizens are spread evenly along it, on the grounds
that people disperse randomly and reach equilibrium quickly compared with the
timescale of disease spread. Then the characteristic diffusion time of the
one-dimensional heat equation gives

$$
t = \frac{L^2}{2\alpha}
$$

where $\alpha$ is now a "disease diffusivity", still with units of
$[\mathrm{L}^2\,\mathrm{T}^{-1}]$, depending on factors like population density
and transmissibility. Think of $\alpha$ as how many square metres the disease
conquers per second. On an order-of-magnitude scale I'd say it cannot be faster
than $1\ \mathrm{m^2\,s^{-1}}$.

Taking $L \approx 10$ km (roughly Hyde Park to downtown Chicago) and
$\alpha \approx 1\ \mathrm{m^2\,s^{-1}}$:

$$
t = \frac{(10^{4}\ \mathrm{m})^2}{2 \times 1\ \mathrm{m^2\,s^{-1}}}
= 5\times10^{7}\ \mathrm{s} \approx 1.6\ \text{years}
$$

So under these assumptions it takes **about 1.6 years** for the epidemic to
cross the city.

### Checking against the SIR model

Using the same setup and assuming one person per metre, the linear city holds
$N = 10^{4}$ people. Take $\beta = 0.5$ per day and $\gamma = 0.1$ per day,
reasonable for a highly infectious disease in a dense city. Feeding those into
the analytical solution of the SIR equations, it takes a little under a year for
the disease to reach half the city.

Our heat-equation estimate of 1.6 years is therefore not unreasonable. Both are
genuinely complicated problems, and yet two quite different routes land on the
same timescale.

## Conclusion

This comparison shows how mathematics provides a common language across fields.
The heat equation and the SIR model describe different worlds, but by mapping
one onto the other and making a few defensible assumptions, we get an answer
that holds up.

## Bibliography

1. Kermack, W. O., & McKendrick, A. G. (1991). "Contributions to the mathematical theory of epidemics — I." *Bulletin of Mathematical Biology*, 53, 33–55. [doi:10.1007/BF02464423](https://doi.org/10.1007/BF02464423)
2. Trench, W. F. "The Heat Equation." [Math LibreTexts](https://math.libretexts.org/Bookshelves/Differential_Equations/Elementary_Differential_Equations_with_Boundary_Value_Problems_(Trench)/12%3A_Fourier_Solutions_of_Partial_Differential_Equations/12.01%3A_The_Heat_Equation)
3. Barlow, N. S., & Weinstein, S. J. (2020). "Accurate closed-form solution of the SIR epidemic model." *Physica D*, 408, 132540. [doi:10.1016/j.physd.2020.132540](https://doi.org/10.1016/j.physd.2020.132540)
4. Image: [UKRI — Epidemiology: what it is and how it's mapping the spread of COVID-19](https://www.ukri.org/news-and-events/tackling-the-impact-of-covid-19/understanding-coronavirus-covid-19-and-epidemics/epidemiology-what-it-is-and-how-its-mapping-the-spread-of-covid-19/)
