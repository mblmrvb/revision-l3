---
id: micro-ch2
ordre: 2
titre: Ch. 2 — Équilibre intertemporel avec production et théorème de Fisher
seances: Séance 3 (autarcie et marchés financiers avec production) et séance 4 (théorème de séparation de Fisher)
sources: Micro cours chapitre 2.pdf (2026-2027) ; Séance 3 diapo micro.pdf ; Séance 4 diapo.pdf
---
# Synthèse flash

1. **Production** : $k^i$ de bien 0 investi donne $f_i(k^i)$ de bien 1 ; $TMT_{1\to0}=f'_i(k^i)$ = productivité marginale = coût d'opportunité du bien 0. [Ch.2 p.2-3](src:)
2. **Autarcie avec production** : $TMS^i_{1\to0}=f'_i(k^i)=TMT^i_{1\to0}$ (tangence FPP / courbe d'indifférence). [Ch.2 p.4](src:)
3. **Avec marché financier** : $TMS^i_{0\to1}=\dfrac{1}{1+r}$ **et** $f'_i(k^i)=1+r$ ; contrainte : $C^i_0+\dfrac{C^i_1}{1+r}=w^i_0+\dfrac{w^i_1}{1+r}+\underbrace{\dfrac{f_i(k^i)}{1+r}-k^i}_{\Pi^i}$. [Ch.2 p.6](src:)
4. **Théorème de Fisher** : à $r$ donné, marchés parfaits et complets ⇒ décisions de **production** ($\max \Pi^i$) et de **consommation** indépendantes (« unanimité des actionnaires »). [Ch.2 p.10](src:)
5. **AR avec production** : $TMS^{AR}_{0\to1}(\Omega_0-k,\ \Omega_1+f(k))=\dfrac1{1+r}$ et $C^i_t=\gamma_i\times(\text{disponible en }t)$, $\gamma_i=\dfrac{w^i_0+\frac{w^i_1}{1+r}+\theta_i\Pi}{\Omega_0+\frac{\Omega_1}{1+r}+\Pi}$. [Ch.2 p.13](src:)

# Cours

## 1. La technologie de production

Le bien 0 a deux usages : être consommé ou être **transformé en bien 1** (comme du blé planté). $k^i$ = bien 0 alloué à la production (« investissement en capital »). [Ch.2 p.1](src:)

Fonction de production standard $f_i$ : deux fois différentiable, $f'_i>0$, $f''_i<0$, $f_i(0)=0$, bornée par $f_i(w^i_0)$. [Ch.2 p.2](src:)

**Frontière des possibilités de production (FPP)** : paniers $(w^i_0-k^i,\ w^i_1+f_i(k^i))$ pour $0\le k^i\le w^i_0$ — courbe **concave** passant par le point de dotation. [Ch.2 p.2-3](src:)

$$TMT_{1\to0}=-\left.\frac{dC_1}{dC_0}\right|_{FPP}=f'(k)$$

= bien 1 qu'on renonce à produire pour garder une unité de bien 0 = **coût d'opportunité** du bien 0. Il diminue quand $k$ augmente (concavité). [Ch.2 p.3](src:)

## 2. Équilibre en autarcie avec production

Contraintes : $w^i_0=C^i_0+k^i$, $C^i_1=w^i_1+f_i(k^i)$. Programme $\max U^i$ ; par substitution ou Lagrange : [Ch.2 p.3-4](src:)

$$TMS^i_{1\to0}=f'_i(k^i)=TMT^i_{1\to0}$$

Valeur relative du bien 0 = son coût d'opportunité. Graphiquement : tangence entre la FPP et la courbe d'indifférence la plus haute (point $A$) ; production et consommation coïncident. [Ch.2 p.4-5](src:)

## 3. Équilibre avec marché financier

Contraintes : [Ch.2 p.5](src:)

$$t=0:\ w^i_0=C^i_0+k^i+S^i\qquad t=1:\ C^i_1=w^i_1+f_i(k^i)+(1+r)S^i$$

Consolidée : $w^i_0+\dfrac{w^i_1}{1+r}+\dfrac{f_i(k^i)}{1+r}=C^i_0+k^i+\dfrac{C^i_1}{1+r}$. Le lagrangien donne : [Ch.2 p.6](src:)

$$TMS^i_{0\to1}=\frac{1}{1+r}\qquad f'_i(k^i)=1+r\ \ (\Leftrightarrow TMT^i_{0\to1}=\tfrac{1}{1+r})$$

**Valeur relative = coût d'opportunité = prix relatif** du bien 1. Pareto-optimalité avec production : $TMS^a=TMS^b=TMT^a=TMT^b$, vérifiée à l'équilibre. [Ch.2 p.6-7](src:)

**Graphique** : production au point $P$ où la pente de la FPP vaut $-(1+r)$ ; la droite de budget (pente $-(1+r)$) est tangente à la FPP en $P$ ; consommation au point $C$ où la droite de budget est tangente à une courbe d'indifférence. $P\neq C$ : l'agent peut être emprunteur ($S^i<0$) ou épargnant. $C$ est sur une courbe d'indifférence plus haute que $A$ : **gain à l'échange intertemporel**. [Ch.2 p.7-9](src:)

## 4. Le théorème de séparation de Fisher

La condition $f'_i(k^i)=1+r\Rightarrow k^i=(f'_i)^{-1}(1+r)$ ne dépend **que de la technologie et de $r$**, ni des goûts ni des dotations ⇒ des investisseurs différents mais avec la même technologie font le même choix (**unanimité des actionnaires**). [Ch.2 p.10](src:)

> **Théorème (Fisher, 1930)** : pour un taux d'intérêt donné, avec des marchés financiers parfaits et complets, les décisions de production et de consommation sont indépendantes. [Ch.2 p.10](src:)

**Résolution en deux temps** : [Ch.2 p.11-12](src:)
1. *Producteur* : $\max_{k^i}\ \bar\Pi^i=\dfrac{f_i(k^i)}{1+r}-k^i$ ⇒ $f'_i(k^i)=1+r$ (profit actualisé en bien 0 ; en bien 1 : $\Pi^i=f_i(k^i)-(1+r)k^i$).
2. *Consommateur-actionnaire* : $w^i_0=C^i_0+S^i$, $C^i_1=w^i_1+(1+r)S^i+(1+r)\bar\Pi^i$ ⇒ $C^i_0+\dfrac{C^i_1}{1+r}=w^i_0+\dfrac{w^i_1}{1+r}+\bar\Pi^i$ et $TMS^i_{0\to1}=\dfrac1{1+r}$.
3. Taux d'équilibre : $S^a(r)+S^b(r)=k^a(r)+k^b(r)$ (épargne des ménages = investissement).

Le théorème **ne tient plus si taux prêteur ≠ taux emprunteur**. Modigliani-Miller justifie de ne regarder que la maximisation du profit. [Ch.2 p.10-12](src:)

**Firme unique, plusieurs actionnaires** : $f'(k^*)=1+r$, $\bar\Pi=\frac{f(k^*)}{1+r}-k^*$, l'agent $i$ détient la part $\theta_i$ : $C^i_0+\frac{C^i_1}{1+r}=w^i_0+\frac{w^i_1}{1+r}+\theta_i\bar\Pi$. [Ch.2 p.12](src:)

Le point $P$ **maximise le profit** : la distance entre la droite de budget passant par $P$ et sa parallèle passant par $W$ vaut $\bar\Pi^i$. [Ch.2 p.14](src:)

## 5. Agent représentatif avec production

Mêmes préférences + TMS homogènes de degré 0 ⇒ l'AR consomme $C^{AR}_0=\Omega_0-k$ et $C^{AR}_1=\Omega_1+f(k)$, et [Ch.2 p.13](src:)

$$TMS^{AR}_{0\to1}\big(\Omega_0-k,\ \Omega_1+f(k)\big)=\frac{1}{1+r}\ \ \text{avec}\ f'(k)=1+r$$

Consommations : $C^i_0=\gamma_i(\Omega_0-k)$, $C^i_1=\gamma_i(\Omega_1+f(k))$, $\gamma_i=\dfrac{w^i_0+\frac{w^i_1}{1+r}+\theta_i\bar\Pi}{\Omega_0+\frac{\Omega_1}{1+r}+\bar\Pi}$. [Ch.2 p.13](src:)

:::exemple
Dans l'exercice des séances 3-4 ($Q_a=\sqrt{k_a}$, $Q_b=2\sqrt{k_b}$, $\beta=10/11$, $\Omega_0=200$), le taux d'équilibre est **négatif** ($r\approx-85{,}9\,\%$) : il n'y a aucune dotation en $t=1$, donc le bien futur est rare et très valorisé. Un taux négatif n'a rien d'absurde dans ce modèle réel — il reflète la rareté relative du bien de demain.
:::

# Pièges classiques

- **$f'(k)=1+r$, pas $f'(k)=r$** : on compare le rendement brut de la production au rendement brut du placement. [Ch.2 p.6](src:)
- **Oublier $k^i$ dans la contrainte de $t=0$** quand il n'y a pas séparation : $w^i_0=C^i_0+k^i+S^i$. [Ch.2 p.5](src:)
- **Avec séparation, ne pas compter deux fois l'investissement** : le consommateur-actionnaire n'a plus $k^i$ dans sa contrainte, il reçoit $\bar\Pi^i$. [Ch.2 p.11](src:)
- **Condition de marché avec production** : $S^a+S^b=k^a+k^b$ (et non $=0$) dans la version avec séparation. [Ch.2 p.12](src:)
- **AR mal évalué** : $TMS^{AR}$ se calcule en $(\Omega_0-k,\ \Omega_1+f(k))$, pas en $(\Omega_0,\Omega_1)$.
- **$\gamma_i$ oublie le profit** : la richesse inclut $\theta_i\bar\Pi$ (et $\bar\Pi$ au dénominateur). [Ch.2 p.13](src:)
- **Fisher conditionnel à $r$ donné** : l'investissement ne dépend pas des préférences *à $r$ donné*, mais $r^*$ lui-même dépend des préférences.

# Fiche mémo

| Objet | Formule |
|---|---|
| TMT | $TMT_{1\to0}=f'(k)$ ; $TMT_{0\to1}=\frac1{f'(k)}$ |
| Autarcie | $TMS_{1\to0}=f'(k)$ |
| Budget (sans séparation) | $w_0=C_0+k+S$ ; $C_1=w_1+f(k)+(1+r)S$ |
| Conditions | $TMS_{0\to1}=\frac1{1+r}$ ; $f'(k)=1+r$ |
| Profit actualisé | $\bar\Pi=\frac{f(k)}{1+r}-k$ |
| Budget actionnaire | $C_0+\frac{C_1}{1+r}=w_0+\frac{w_1}{1+r}+\theta\bar\Pi$ |
| Marché (séparation) | $\sum_i S^i=\sum_i k^i$ |
| AR | $TMS^{AR}_{0\to1}(\Omega_0-k,\Omega_1+f(k))=\frac1{1+r}$ |
| Partage | $C^i_t=\gamma_i\,(\text{dispo}_t)$, $\gamma_i=\frac{W^i_0+\theta_i\bar\Pi}{W_0+\bar\Pi}$ |
| $f=A\sqrt k$ (généralisation ajoutée, cf. séance 3 avec $A=1$ et $A=2$) | $k=\frac{A^2}{4(1+r)^2}$, $f(k)=\frac{A^2}{2(1+r)}$, $\bar\Pi=\frac{A^2}{4(1+r)^2}$ |

**Réflexes** : (1) règle d'investissement $f'(k)=1+r$ ⇒ $k(r)$, $Q(r)$, $\bar\Pi(r)$ ; (2) budget consolidé avec $\bar\Pi$ ; (3) justifier l'AR ; (4) $TMS^{AR}$ au point de production ; (5) partage $\gamma_i$.
