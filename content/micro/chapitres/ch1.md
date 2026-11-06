---
id: micro-ch1
ordre: 1
titre: Ch. 1 — Équilibre intertemporel en économie d'échange pur
seances: Séance 1 (allocations Pareto-optimales) et séance 2 (marché des prêts et des emprunts, agent représentatif)
sources: Micro L3 chapitre 1.pdf (2026-2027) ; diapo Séance 1 micro.pdf ; diapo Séance 2 micro.pdf
---
# Synthèse flash

1. **TMS intertemporel** : $TMS^i_{1\to0}=\dfrac{\partial U^i/\partial C^i_0}{\partial U^i/\partial C^i_1}=-\left.\dfrac{dC^i_1}{dC^i_0}\right|_{U^i=\bar U}$ et $TMS_{0\to1}=\dfrac{1}{TMS_{1\to0}}$. [Ch.1 p.1-2](src:)
2. **Pareto-optimalité** : faisabilité ($C^a_t+C^b_t=\Omega_t$) **et** égalité des TMS : $TMS^a_{1\to0}=TMS^b_{1\to0}$. [Ch.1 p.3](src:)
3. **Équilibre avec marché financier** (taux $r$) : $TMS^i_{0\to1}=\dfrac{1}{1+r}$ pour tout agent ; contrainte consolidée $C^i_0+\dfrac{C^i_1}{1+r}=w^i_0+\dfrac{w^i_1}{1+r}$. [Ch.1 p.9-10](src:)
4. **Lissage** : avec des préférences standards, $\dfrac{C^i_1}{C^i_0}=\dfrac{\Omega_1}{\Omega_0}$ (cas $\ln$) : la consommation suit les **dotations globales**, pas les dotations individuelles. [Ch.1 p.5-6](src:)
5. **Agent représentatif** (mêmes préférences, TMS homogènes de degré 0) : $TMS^{AR}_{0\to1}(\Omega_0,\Omega_1)=\dfrac{1}{1+r}$ donne directement $r^*$, puis $C^i_t=k_i\,\Omega_t$ avec $k_i=\dfrac{w^i_0+w^i_1/(1+r)}{\Omega_0+\Omega_1/(1+r)}$. [Ch.1 p.14-16](src:)

# Cours

## 1. Le cadre : deux agents, deux dates, un bien daté

- Deux agents $i=a,b$, deux dates $t=0$ (aujourd'hui) et $t=1$ (demain), un bien physique **différencié par sa date** : le bien 0 et le bien 1. Concurrence parfaite, échange pur (pas de production), dotations exogènes $(w^i_0,w^i_1)$, bien **non stockable**. [Ch.1 p.1](src:)
- Préférences **standards** : $U^i(C^i_0,C^i_1)$ deux fois différentiable, strictement croissante ($U'_{ij}>0$) et strictement concave ($U''_{ij}<0$). Les courbes d'indifférence sont décroissantes et convexes. [Ch.1 p.1-2](src:)

**Le TMS intertemporel.** $TMS^i_{1\to0}$ = quantité de bien qu'il faut sacrifier **demain** pour obtenir une unité de plus **aujourd'hui** à utilité constante. En différenciant $U^i(C^i_0,C^i_1)=\bar U$ :

$$\frac{\partial U^i}{\partial C^i_0}dC^i_0+\frac{\partial U^i}{\partial C^i_1}dC^i_1=0\;\Rightarrow\;TMS^i_{1\to0}=-\frac{dC^i_1}{dC^i_0}=\frac{\partial U^i/\partial C^i_0}{\partial U^i/\partial C^i_1}$$

C'est la pente (en valeur absolue) de la courbe d'indifférence ; il est **décroissant** avec des préférences standards. [Ch.1 p.2](src:)

## 2. Les allocations Pareto-optimales

Une allocation est Pareto-optimale s'il n'existe pas d'allocation faisable qui améliore la situation d'un agent sans dégrader celle d'au moins un autre. Programme : [Ch.1 p.2](src:)

$$\max_{C^a_0,C^a_1,C^b_0,C^b_1} U^a(C^a_0,C^a_1)\ \text{ s.c. }\ U^b(C^b_0,C^b_1)\ge\bar U,\quad C^a_0+C^b_0\le\Omega_0,\quad C^a_1+C^b_1\le\Omega_1$$

avec $\Omega_t=w^a_t+w^b_t$ les dotations globales. Lagrangien (contraintes de faisabilité saturées, positivité négligée) : [Ch.1 p.3](src:)

$$\mathcal L=U^a+\lambda\big[\bar U-U^b\big]+\mu^P_0\big[\Omega_0-C^a_0-C^b_0\big]+\mu^P_1\big[\Omega_1-C^a_1-C^b_1\big]$$

Les CPO donnent $\dfrac{\partial U^a/\partial C^a_0}{\partial U^a/\partial C^a_1}=\dfrac{\partial U^b/\partial C^b_0}{\partial U^b/\partial C^b_1}=\dfrac{\mu^P_0}{\mu^P_1}$, soit **$TMS^a_{1\to0}=TMS^b_{1\to0}$** : les courbes d'indifférence sont tangentes dans la boîte d'Edgeworth. L'ensemble de ces points = **courbe des contrats**. Les $\mu^P_t$ sont des « prix implicites ». [Ch.1 p.3-4](src:)

### Biens datés parfaitement substituables
$U^i=cC^i_0+dC^i_1$ ⇒ $TMS^i_{1\to0}=c/d$ constant : **toute** allocation est Pareto-optimale (seule compte la quantité totale). Hypothèse peu réaliste (« se goinfrer aujourd'hui et mourir de faim demain »). [Ch.1 p.4-5](src:)

### Biens imparfaitement substituables
$U^i=c\ln C^i_0+d\ln C^i_1$ ⇒ $TMS^i_{1\to0}=\dfrac{c\,C^i_1}{d\,C^i_0}$. L'égalité des TMS donne [Ch.1 p.5](src:)

$$\frac{C^a_1}{C^a_0}=\frac{C^b_1}{C^b_0}=\frac{C^a_1+C^b_1}{C^a_0+C^b_0}=\frac{\Omega_1}{\Omega_0}\quad\Rightarrow\quad C^i_1=\frac{\Omega_1}{\Omega_0}C^i_0$$

- si $\Omega_1>\Omega_0$, la consommation croît ; si $\Omega_0>\Omega_1$, elle décroît ;
- si $\Omega_0=\Omega_1$ : $C^i_0=C^i_1$, **le lissage parfait est optimal**, quel que soit le profil des dotations individuelles. [Ch.1 p.6](src:)

Ce goût pour le lissage vient de la **préférence pour les combinaisons convexes** (stricte concavité de $U$). [Ch.1 p.6, note 4](src:)

## 3. L'équilibre avec un marché des prêts et des emprunts

**Pourquoi un marché ?** En autarcie, $C^i_t=w^i_t$. Si $w^a_0<w^a_1$ et $w^b_0>w^b_1$ (log), alors $TMS^a_{1\to0}>TMS^b_{1\to0}$ : l'allocation initiale n'est pas efficace et un échange intertemporel mutuellement avantageux existe. Acheter du bien 0 = **emprunter** ; acheter du bien 1 = **épargner**. [Ch.1 p.6-7](src:)

Un marché financier est **parfait** (pas de coûts de transaction, accès libre, information parfaite, pas de rationnement ni de défaut) et le système est **complet** s'il permet de réallouer entre toutes les dates : avec $T$ dates il faut $T-1$ marchés. [Ch.1 p.7](src:)

**Contraintes budgétaires** ($S^i>0$ épargne, $S^i<0$ emprunt) : [Ch.1 p.8](src:)

$$t=0:\ w^i_0=C^i_0+S^i\qquad t=1:\ C^i_1=w^i_1+(1+r)S^i$$

Équilibre des marchés : $C^a_0+C^b_0=\Omega_0$, $C^a_1+C^b_1=\Omega_1$, $S^a+S^b=0$ — **une des trois est redondante** (loi de Walras). [Ch.1 p.8](src:)

**Condition d'équilibre** (Lagrange ou substitution, même résultat) : [Ch.1 p.8-9](src:)

$$TMS^i_{0\to1}=\frac{\partial U^i/\partial C^i_1}{\partial U^i/\partial C^i_0}=\frac{1}{1+r}\quad\Longleftrightarrow\quad\frac{\partial U^i}{\partial C^i_0}=(1+r)\frac{\partial U^i}{\partial C^i_1}\ \text{(équation d'Euler)}$$

**Interprétation** : $\frac{1}{1+r}$ est le **prix relatif du bien 1 en bien 0** (il faut épargner $\frac1{1+r}$ aujourd'hui pour avoir 1 demain) ; $TMS_{0\to1}$ est sa **valeur relative subjective**. À l'équilibre valeur = prix. Comme tous les agents égalisent leur TMS au **même** prix, les TMS sont égaux entre eux ⇒ **l'équilibre est Pareto-optimal**. Si le taux prêteur ≠ taux emprunteur, ce n'est plus vrai. [Ch.1 p.9-10](src:)

**Contrainte consolidée / programme walrassien** : $C^i_0+\dfrac{C^i_1}{1+r}=w^i_0+\dfrac{w^i_1}{1+r}$ (valeur présente des dépenses = valeur présente des revenus). L'équilibre intertemporel est donc un équilibre concurrentiel où le prix du bien 0 vaut 1 et celui du bien 1 vaut $\frac1{1+r}$ : le **1er théorème du bien-être** s'applique. [Ch.1 p.10-11](src:)

**Généralisation à $T+1$ dates** : $w^i_t+(1+r_t)S^i_{t-1}=C^i_t+S^i_t$ ; la contrainte intertemporelle est $\sum_t \dfrac{C^i_t}{\prod_{\tau=1}^t(1+r_\tau)}=\sum_t \dfrac{w^i_t}{\prod_{\tau=1}^t(1+r_\tau)}$ et $TMS^i_{0\to t}=\dfrac{1}{(1+r_1)\cdots(1+r_t)}$. [Ch.1 p.11-13](src:)

## 4. L'agent représentatif (AR)

**Méthode standard** : résoudre pour chaque agent le système $\{TMS^i_{0\to1}=\frac1{1+r};\ w^i_0=C^i_0+S^i;\ C^i_1=w^i_1+(1+r)S^i\}$ ⇒ $C^i_t(r),S^i(r)$, puis $S^a(r)+S^b(r)=0$ ⇒ $r^*$. [Ch.1 p.13](src:)

**Méthode AR** (à utiliser **dès que les conditions sont réunies**) : quand les préférences sont **identiques et homothétiques**, les demandes individuelles sont linéaires en la richesse et les demandes agrégées ne dépendent pas de la répartition des dotations. [Ch.1 p.14](src:)

> **Théorème de l'agent représentatif** : en échange pur avec un système financier complet et parfait, si les agents ont les mêmes préférences et des TMS homogènes de degré 0 ($TMS(\lambda C_0,\lambda C_1)=TMS(C_0,C_1)$), alors $TMS^{AR}_{0\to1}(\Omega_0,\Omega_1)=\dfrac{1}{1+r}$. [Ch.1 p.14](src:)

Puis **partage linéaire** : $C^i_t=k_i\,\Omega_t$ avec $k_i=\dfrac{w^i_0+\frac{w^i_1}{1+r}}{\Omega_0+\frac{\Omega_1}{1+r}}$ (part de la richesse de $i$ dans la richesse globale), $k_a+k_b=1$. [Ch.1 p.15-16](src:)

:::exemple
Cas type ($U^i=\ln C^i_0+\beta\ln C^i_1$, séance 2) : $TMS^{AR}_{0\to1}=\beta\Omega_0/\Omega_1$ donc $r=\dfrac{\Omega_1}{\beta\Omega_0}-1$. Avec $\beta=10/11$ et $\Omega_0=\Omega_1=200$ : $r=10\,\%$. Intuition finance : plus l'économie anticipe une croissance des ressources ($\Omega_1\uparrow$), plus les agents veulent emprunter pour lisser, et plus le taux d'intérêt d'équilibre monte.
:::

# Pièges classiques

- **Confondre $TMS_{1\to0}$ et $TMS_{0\to1}$** : $TMS_{1\to0}=\frac{\partial U/\partial C_0}{\partial U/\partial C_1}=1+r$ à l'équilibre, alors que $TMS_{0\to1}=\frac1{1+r}$. Écris toujours le ratio avant de simplifier. [Ch.1 p.9](src:)
- **Signe de $S^i$** : une seule convention, $S^i>0$ épargne, $S^i<0$ emprunt, et les mêmes contraintes pour tous. Ne change pas de contrainte selon que l'agent prête ou emprunte. [Ch.1 p.8, note 7](src:)
- **Oublier la redondance** : $S^a+S^b=0$ est impliquée par l'équilibre du marché du bien 0 ; n'utilise qu'**une** condition de marché pour trouver $r$. [Ch.1 p.8](src:)
- **Utiliser l'AR sans le justifier** : il faut **dire** « mêmes préférences + TMS homogènes de degré 0 (+ marchés complets et parfaits) » — c'est souvent noté. [Ch.1 p.14](src:)
- **Évaluer le TMS de l'AR au mauvais point** : en échange pur, l'AR consomme $(\Omega_0,\Omega_1)$, pas les dotations d'un agent. [Ch.1 p.14](src:)
- **Lissage** : la consommation optimale suit $\Omega_1/\Omega_0$ (dotations **globales**), pas le profil des dotations individuelles. [Ch.1 p.5](src:)
- **Arrondis** : garde les fractions ($\beta=10/11$, $r=1/10$) le plus longtemps possible.

# Fiche mémo

**Notations** : $w^i_t$ dotation, $\Omega_t=\sum_i w^i_t$, $S^i$ épargne (>0) / emprunt (<0), $r$ taux.

| Objet | Formule |
|---|---|
| TMS | $TMS_{1\to0}=\frac{U'_0}{U'_1}$, $TMS_{0\to1}=\frac{U'_1}{U'_0}$ |
| Pareto | $TMS^a=TMS^b$ + $\sum_i C^i_t=\Omega_t$ |
| Log $c\ln C_0+d\ln C_1$ | $TMS_{1\to0}=\frac{cC_1}{dC_0}$ ; PO : $C^i_1=\frac{\Omega_1}{\Omega_0}C^i_0$ |
| Budget | $w_0=C_0+S$ ; $C_1=w_1+(1+r)S$ |
| Consolidée | $C_0+\frac{C_1}{1+r}=w_0+\frac{w_1}{1+r}$ |
| Équilibre | $TMS_{0\to1}=\frac1{1+r}$ (Euler : $U'_0=(1+r)U'_1$) |
| $T+1$ dates | $TMS_{0\to t}=\prod_{\tau\le t}\frac1{1+r_\tau}$ |
| AR | $TMS^{AR}_{0\to1}(\Omega_0,\Omega_1)=\frac1{1+r}$ |
| Partage | $C^i_t=k_i\Omega_t$, $k_i=\frac{W^i_0}{\sum_j W^j_0}$ |
| $\ln C_0+\beta\ln C_1$ | $C_0=\frac{W_0}{1+\beta}$, $C_1=\frac{\beta(1+r)W_0}{1+\beta}$, $r=\frac{\Omega_1}{\beta\Omega_0}-1$ |

**Réflexes** : (1) écrire les contraintes par date, (2) consolider, (3) condition TMS, (4) justifier l'AR, (5) une seule condition de marché, (6) vérifier $\sum_i C^i_t=\Omega_t$.
