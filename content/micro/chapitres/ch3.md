---
id: micro-ch3
ordre: 3
titre: Ch. 3 — Équilibre général et évaluation des actifs financiers
seances: Séance 5 (évaluation par la synthèse, zéro-coupons, taux courts et longs)
sources: Micro L3 chapitre 3.pdf (2026-2027) ; séance 5 diapo.pdf
---
# Synthèse flash

1. **Actif** $V:(w_1,\dots,w_T)$ de prix $q$ ; **zéro-coupon** $ZC_t$ paie 1 en $t$, prix $\beta_t$ ; **obligation** $B_t:(R_t,\dots,R_t,1+R_t)$ pour un prix de 1. [Ch.3 p.1-2](src:)
2. **AOA** (absence d'opportunité d'arbitrage) : un actif et son portefeuille de synthèse ont le **même prix**. [Ch.3 p.2-3](src:)
3. **Avec des ZC** : $q=\sum_{t=1}^T w_t\,\beta_t$ — les $\beta_t$ sont des **facteurs d'actualisation**. [Ch.3 p.4](src:)
4. **Taux courts** : $\beta_t=\dfrac{1}{(1+r_1)\cdots(1+r_t)}$, donc $\beta_t=\dfrac{\beta_{t-1}}{1+r_t}$ et $r_t=\dfrac{\beta_{t-1}}{\beta_t}-1$. [Ch.3 p.5](src:)
5. **Taux longs** : $1=R_t\sum_{\tau=1}^t\beta_\tau+\beta_t$ ⇔ $R_t=\dfrac{1-\beta_t}{\sum_{\tau=1}^t\beta_\tau}$. [Ch.3 p.6](src:)

# Cours

## 1. Les actifs financiers

Tout actif financier (promesse contractuelle de revenu futur échangeable sur un marché parfait) permet la réallocation intertemporelle, pas seulement le marché des prêts. La vente à découvert est possible. [Ch.3 p.1](src:)

- Actif $V:(w_1,w_2,\dots,w_T)$ de prix $q$ en $t=0$.
- **Bon du Trésor** d'échéance $\tau$ : pour 1 investi, coupon $R_\tau$ en $t=1,\dots,\tau-1$ et $1+R_\tau$ en $\tau$. $R_\tau$ = **taux long** d'échéance $\tau$. [Ch.3 p.1](src:)
- **Zéro-coupon** $ZC_\tau$ : paie 1 uniquement en $\tau$, prix $\beta_\tau$. Un **système complet** de ZC = un ZC par échéance. [Ch.3 p.2](src:)

## 2. L'évaluation par la synthèse en marchés complets

**Portefeuille de synthèse** : combinaison d'actifs existants qui livre **exactement** les mêmes paiements que l'actif à évaluer. Ex. : $V_1:(\frac12,1,1)$, $V_2:(\frac12,0,\frac12)$, $V_3:(0,0,\frac12)$ ⇒ $V:(1,1,2)=V_1+V_2+V_3$. [Ch.3 p.2](src:)

**Arbitrage** : opération qui exploite un écart de prix entre actifs similaires pour un gain sûr. Si $q>q_1+q_2+q_3$, acheter le portefeuille et vendre $V$ rapporte $q-(q_1+q_2+q_3)>0$ en $t=0$ et 0 ensuite. Sur un marché parfait, ces opportunités disparaissent (loi du prix unique) ⇒ $q=q_1+q_2+q_3$. [Ch.3 p.2-3](src:)

### Avec des titres quelconques
On cherche les quantités $(a,b,c,d)$ telles que le portefeuille réplique $V$ **date par date** (une équation par date), puis $q=a q_1+b q_2+c q_3+d q_4$. Ex. du cours : $V:(3,2,2,1)$ avec $V_1:(2,1,1,1)$, $V_2:(1,0,1,0)$, $V_3:(0,0,0,1)$, $V_4:(1,2,1,2)$ donne $a=1,\ b=\frac12,\ c=-1,\ d=\frac12$. Une quantité **négative** = vente à découvert. [Ch.3 p.3-4](src:)

La complétude exige **autant d'actifs linéairement indépendants que de dates futures**. [Ch.3 p.3](src:)

### Avec des zéro-coupons
Immédiat : $V=w_1ZC_1+\dots+w_TZC_T$ donc $q=\sum_t w_t\beta_t$. [Ch.3 p.4](src:)

:::methode
Si l'énoncé donne des actifs quelconques **avec leurs prix**, le plus rapide est souvent de **retrouver les $\beta_t$** : chaque prix connu donne une équation $q_j=\sum_t w^j_t\beta_t$. On résout pour les $\beta_t$, puis tout nouvel actif se price par $\sum_t w_t\beta_t$. C'est la méthode du corrigé de la séance 5. [Séance 5, diapo 22](src:)
:::

## 3. Prix des ZC et taux d'intérêt

**Taux courts** $r_t$ (prêt entre $t-1$ et $t$). Pour avoir 1 en $t=1$ : acheter $ZC_1$ (coût $\beta_1$) ou épargner $\frac1{1+r_1}$ ⇒ $\beta_1=\frac1{1+r_1}$. Pour avoir 1 en $t=2$ : épargner $\frac{1}{(1+r_1)(1+r_2)}$ puis réinvestir ⇒ $\beta_2=\frac{1}{(1+r_1)(1+r_2)}$. En général : [Ch.3 p.5](src:)

$$\beta_t=\frac{1}{(1+r_1)(1+r_2)\cdots(1+r_t)}\qquad\beta_t=\frac{\beta_{t-1}}{1+r_t}$$

**Taux longs** $R_t$ : l'obligation coûte 1 et se réplique avec des ZC : [Ch.3 p.6](src:)

$$1=\beta_1R_t+\dots+\beta_{t-1}R_t+\beta_t(1+R_t)\ \Rightarrow\ R_t=\frac{1-\beta_t}{\sum_{\tau=1}^t\beta_\tau}$$

et la relation de récurrence (courbe des taux) : $R_t=\dfrac{(1-\beta_t)R_{t-1}}{(1-\beta_{t-1})+\beta_tR_{t-1}}$. [Ch.3 p.6](src:)

Pour remonter des taux obligataires aux ZC : $\beta_1=\dfrac1{1+R_1}$ puis $\beta_t=\dfrac{1-R_t\sum_{\tau<t}\beta_\tau}{1+R_t}$. [Exos partie I, ex. 4.3](src:)

**Lien avec l'équilibre** : à l'équilibre, $TMS^i_{0\to t}=\beta_t$ (et $TMS^i_{1\to2}=\beta_2/\beta_1$). [Exos partie I, ex. 3 Q6](src:)

:::exemple
En finance de marché, la « courbe des taux zéro-coupon » est exactement ce vecteur $(\beta_1,\dots,\beta_T)$ : on l'extrait des prix d'obligations (bootstrapping) puis on actualise n'importe quel flux certain avec. Un $\beta_t>\beta_{t-1}$ implique un taux court $r_t<0$ (cas du corrigé de la séance 5).
:::

# Pièges classiques

- **Répliquer date par date** : une équation **par date**, pas une seule équation sur les sommes. [Ch.3 p.3](src:)
- **Signe des quantités** : $c=-1$ signifie vendre à découvert une unité de $V_3$ ; c'est autorisé. [Ch.3 p.4](src:)
- **$r_t=\beta_{t-1}/\beta_t-1$** (et non $\beta_t/\beta_{t-1}-1$) ; pour $t=1$, $\beta_0=1$. [Séance 5, diapo 24](src:)
- **Prix en $t=1$ d'un actif** : diviser la valeur en 0 par $\beta_1$ (ramener en unités de la date 1). [Exos partie I, ex. 4.1 Q2](src:)
- **Paiement étalé** : « payé $p_1$ en 1 et $p_2$ en 2 » ⇒ valeur actualisée des revenus = $p_1\beta_1+p_2\beta_2$. [Exos partie I, ex. 4.1 Q4](src:)
- **Taux longs ≠ taux courts** : $R_t$ est un coupon constant, $r_t$ un taux d'une période.
- **Actif « max »** : $\max(A,150B)$ se calcule **date par date** avant d'actualiser. [CC 2019, ex. 1 Q4](src:)

# Fiche mémo

| Objet | Formule |
|---|---|
| ZC | $ZC_t$ paie 1 en $t$, prix $\beta_t$ |
| Prix d'un actif | $q=\sum_t w_t\beta_t$ |
| AOA | prix actif = coût du portefeuille de synthèse |
| Taux courts → ZC | $\beta_t=\prod_{\tau\le t}\frac{1}{1+r_\tau}$ |
| ZC → taux courts | $r_t=\frac{\beta_{t-1}}{\beta_t}-1$ ($\beta_0=1$) |
| Taux longs | $R_t=\frac{1-\beta_t}{\sum_{\tau\le t}\beta_\tau}$ |
| Taux longs → ZC | $\beta_t=\frac{1-R_t\sum_{\tau<t}\beta_\tau}{1+R_t}$ |
| Valeur en $t=s$ | $q_s=\frac{1}{\beta_s}\sum_{t>s}w_t\beta_t$ |
| Équilibre | $TMS_{0\to t}=\beta_t$ |

**Réflexes** : (1) écrire chaque actif comme un vecteur de paiements, (2) une équation par date, (3) passer par les $\beta_t$ dès que possible, (4) vérifier les signes (vente à découvert).
