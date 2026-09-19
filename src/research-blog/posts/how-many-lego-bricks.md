---
title: How many Lego bricks are sold each year?
subtitle: A Fermi problem — from city populations and set sizes to roughly a thousand bricks a second.
date: 2023-10-07
tags: ["fermi problem", "order of magnitude"]
---

I've always been a huge Lego fan. Ever since I got my first set in the 2010s, my
room has been steadily filling up with colourful plastic in every shape and
size. Living in a college dormitory has (temporarily) hampered the expansion of
my ever-growing Lego empire, so I'll have to exercise my adoration for the toy
in a more academic way instead.

The question for this post: **how many Lego bricks are sold each year around the
globe?** To crack it, I'll estimate the number of sets sold and the average
number of bricks per set, among other factors.

## A wild guess

Without any calculation I'd say the answer is in the billions, given Lego's
global popularity and the fact that each set contains many bricks.

A simple sanity check points the same way: if every child in the world received
just one Lego piece per year on average, we'd already be in the billions. So the
order of magnitude seems reasonable.

## An educated guess

To do better, I need two quantities: the number of sets sold globally each year,
and the average number of bricks per set.

Let me break the first one down by city.

> From visiting various cities around the world, Lego seems to be most popular
> in large metropolises, where multiple stores sit in the major shopping
> centres, while smaller cities often have no Lego store at all. That suggests
> the majority of sales originate in large cities. Assume roughly 100 cities
> worldwide account for about half of global sales, and the rest of the world
> shares the other half.

So the problem becomes estimating sets sold per large city:

> Assume that, on average, 1 in 10 people in these cities buys a set per year —
> roughly one set per two households, which feels about right. City populations
> vary a lot: take an upper bound of 20 million (Beijing, Mumbai) and a lower
> bound of 500 thousand (Boston, Dublin). The geometric mean gives about
> 3 million people per city.

Now the bricks per set:

> Most sets I've built have been 500–1000 pieces, but the true range is far
> wider. Casual fans rarely go over 500 pieces, while dedicated builders invest
> in sets running to several thousand. A geometric mean is appropriate here,
> because cheaper, lower-piece-count sets sell in much larger numbers. Taking
> the geometric mean of 50 and 5000 gives about 500 pieces per set.

Putting it together:

$$
B \;=\; \frac{N_c \, L_c \, P \, N}{R_c}
\;=\; \frac{100 \times \tfrac{1}{10} \times 3\times10^{6} \times 500}{1/2}
\;=\; 3\times10^{10}
$$

**About 30 billion bricks a year.**

## Variables

| Symbol | Quantity | Value |
| --- | --- | --- |
| $R_c$ | Fraction of sales from the largest cities | 1/2 |
| $N_c$ | Number of large cities | 100 |
| $L_c$ | Sets bought per person per year | 1/10 |
| $P$ | Population per large city | $3\times10^{6}$ |
| $N$ | Bricks per set | 500 |

## Gathering data

After some research, here are bounds on each quantity. Note that almost all of
these are themselves order-of-magnitude estimates — more grounded than my
guesses, but not free of error.

| Symbol | Smallest | Most likely | Largest | Basis |
| --- | --- | --- | --- | --- |
| $R_c$ | — | 1/2 | — | Assumption |
| $N_c$ | 44 | 100 | 200 | ~900 Lego stores across 44 countries and ~200 cities [1] |
| $L_c$ | — | 1/10 | 1/5 | Every person on Earth owns ~86 Lego bricks on average [2] |
| $P$ | $5\times10^{5}$ | $3\times10^{6}$ | $3.7\times10^{7}$ | Tokyo is the most populous city [3]; most cities with Lego stores exceed $10^{6}$ [1] |
| $N$ | 1 | 500 | $1.1\times10^{4}$ | Art World Map has ~11,000 pieces; single-piece sets exist [4] |
| $B$ | $4.4\times10^{6}$ | $3\times10^{10}$ | $3.25\times10^{13}$ | Propagated through the formula above |

## Conclusions

Roughly **30 billion** Lego bricks are sold worldwide each year, with the
extreme bounds spanning 4.4 million to 32.5 trillion. The dominant sources of
error are the spread in bricks per set and in annual sales volume. A deeper dive
could look at how these numbers have changed over time, or how they vary by
region.

One fact I enjoyed: dividing by the number of seconds in a year, retailers sell
about **1000 Lego bricks every second**. It's striking how an answer that seems
sensible on a global scale becomes daunting once converted into a more familiar
unit.

## References

1. [LEGO Retail Store — Brickipedia](https://brickipedia.fandom.com/wiki/LEGO_Retail_Store)
2. [Fun facts about LEGO — Museum of Science and Industry, Chicago](https://www.msichicago.org/fileadmin/assets/press/brick_by_brick_press_kit/FUN_FACTS_ABOUT_LEGO_R_.pdf)
3. [The World's Cities in 2018 — United Nations](https://www.un.org/en/events/citiesday/assets/pdf/the_worlds_cities_in_2018_data_booklet.pdf)
4. [The biggest LEGO sets ever made](https://www.lego.com/en-us/categories/adults-welcome/article/biggest-lego-sets-ever-made)
