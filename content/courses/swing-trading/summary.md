---
title: "Swing Trading"
topic_slug: swing-trading
course_count: 1
generated_at: "2026-07-06T06:54:45.840Z"
type: topic-summary
---
#Swing Trading

## Overview
Swing trading is a medium‑term trading style that aims to capture price moves unfolding over several days to weeks by exploiting short‑ to medium‑term momentum. Unlike day trading, it does not require constant intraday monitoring, yet it still relies on sufficient intraday volatility to generate meaningful profit potential within the holding period. Traders use volatility proxies—such as the Average Daily Range expressed as a percentage (ADR%)—to filter securities that are likely to travel far enough to justify the risk taken. This page consolidates the knowledge from the course **Understanding ADR% Thresholds for Effective Swing Trading** (@Gaurav_Cx10), focusing on how ADR% serves as a practical, normalized volatility metric for identifying high‑probability swing‑trade candidates. Readers will find detailed explanations of ADR% calculation, interpretation of its threshold zones, and concrete steps to embed this tool into a swing‑trading workflow.

## Key Concepts

### Average Daily Range (ADR)
The Average Daily Range is the arithmetic mean of the absolute difference between a security’s high and low prices over a defined look‑back period (commonly 10–20 days). It quantifies the typical intraday price excursion, providing a raw measure of volatility that is independent of direction.

### ADR% (Average Daily Range as a Percentage)
ADR% normalizes the ADR by dividing it by the security’s closing price (or sometimes the midpoint of the high‑low range) and expressing the result as a percentage. This transformation allows traders to compare volatility across stocks with vastly different price levels—for example, a ₹200 stock and a ₹2,000 stock—on a common scale.

### Calculation of ADR%
1. For each day in the look‑back window, compute the daily range: `High – Low`.  
2. Average these daily ranges over the window to obtain ADR.  
3. Divide ADR by the most recent closing price (or the average closing price over the window) and multiply by 100:  
   `ADR% = (ADR / Close) × 100`.  
The result is a percentage that reflects how much the price typically moves intraday relative to its level.

### Four Threshold Zones (per @Gaurav_Cx10)
The course distills observed market behavior into four ADR% zones that help traders quickly gauge whether a chart’s volatility is conducive to swing trading:  

| Zone | Approximate ADR% Range | Interpretation |
|------|------------------------|----------------|
| **Low** | < 0.5 % | Price movement is too muted; unlikely to generate sufficient swing profit within a few days. |
| **Moderate (Sweet Spot)** | 0.5 % – 1.5 % | Adequate intraday volatility to produce meaningful moves while keeping risk manageable; ideal for momentum‑based swing entries. |
| **High** | 1.5 % – 3.0 % | Volatility is elevated; larger swings possible but also higher chance of whipsaws and larger stop‑losses. |
| **Excessive** | > 3.0 % | Extreme volatility often driven by news or events; price may gap or reverse sharply, making swing timing difficult. |

These zones are not absolute; they serve as a starting point that traders can adjust based on asset class, market regime, and personal risk tolerance.

### Volatility Sweet Spot
The “sweet spot” (moderate zone) represents the range where ADR% indicates enough price movement to capture a profitable swing yet remains low enough to allow tight stop‑loss placement and realistic profit targets. Staying within this zone improves the probability that a trade will reach its target before being stopped out by random noise.

### Swing Trade Candidate Filtering
Using ADR% as a pre‑trade filter involves:  

1. **Screening** the watchlist for securities whose latest ADR% falls inside the sweet‑spot zone.  
2. **Confirming** the presence of a technical setup (e.g., pull‑back to support, breakout from consolidation, or candlestick reversal pattern).  
3. **Evaluating** the risk‑reward ratio based on the ADR%‑derived expected move (e.g., targeting 1–2× the ADR for profit).  
4. **Excluding** securities that are either too stagnant (low ADR%) or excessively volatile (high/excessive ADR%) unless the trader has a specific strategy for those regimes.

### Look‑Back Period Selection
The look‑back window used to compute ADR influences the responsiveness of the metric. A shorter window (5–10 days) reacts quickly to recent changes in volatility, useful for fast‑moving markets. A longer window (20–30 days) smooths out transient spikes, providing a more stable estimate of typical intraday range. Traders often experiment with multiple windows and choose the one that best aligns with their intended holding period.

## Techniques & Methods

### Step‑by‑Step ADR% Workflow
1. **Data Collection** – Gather daily OHLC (open, high, low, close) data for the target universe via a broker API, financial data vendor, or public source (e.g., Yahoo Finance, NSE/BSE archives).  
2. **Compute Daily Range** – For each bar, calculate `High – Low`.  
3. **Average the Range** – Apply a simple moving average (SMA) over the chosen look‑back period to obtain ADR.  
4. **Normalize** – Divide ADR by the most recent closing price (or the SMA of close) and multiply by 100 to get ADR%.  
5. **Zone Classification** – Map the resulting ADR% to one of the four thresholds (Low, Moderate, High, Excessive).  
6. **Screening** – Filter the universe to retain only symbols whose ADR% lies in the Moderate zone (or a customized range).  
7. **Technical Confirmation** – Apply additional swing‑trade criteria (trendlines, moving‑average crossovers, RSI divergence, volume spikes, etc.).  
8. **Position Sizing** – Determine trade size based on a fixed fractional risk model (e.g., risk 1 % of equity) using the stop‑loss distance derived from recent volatility (often a multiple of ADR).  
9. **Entry & Exit** – Enter on the confirmed signal; set an initial stop‑loss just beyond the recent swing low/high; set a profit target at 1–2× the ADR (or at a predefined resistance/support level).  
10. **Review & Adapt** – At the end of each trading week, review ADR% distribution of traded symbols, adjust look‑back period or threshold ranges if market volatility regime has shifted.

### Tools & Implementation
- **Spreadsheets** (Excel/Google Sheets): Simple formulas for daily range, AVERAGE, and division; conditional formatting to highlight ADR% zones.  
- **Programming Languages**: Python with pandas (`df['high'] - df['low']`, `.rolling(window).mean()`, `.shift()`), or R with TTR/quantmod packages.  
- **Trading Platforms**: Many platforms (Thinkorswim, TradingView, MetaTrader) allow custom indicators; ADR% can be built using Pine Script or ThinkScript.  
- **Backtesting Frameworks**: Use backtrader, Zipline, or QuantConnect to test the ADR% filter across historical data and optimize look‑back length and threshold bounds.

### Risk Management Integration
Because ADR% reflects expected intraday movement, it can directly inform stop‑loss placement: a common rule is to set the initial stop at `1 × ADR` (or `0.5 × ADR` for tighter risk) away from the entry price, ensuring the stop is wide enough to accommodate normal price noise but not so wide as to sacrifice reward potential.

## Insights & Lessons Learned
*(First‑person perspective, synthesized from the course material)*  

- I realized that expressing volatility as a percentage of price (ADR%) removes the bias that high‑priced stocks appear less volatile simply because their absolute moves are larger in rupee terms.  
- The four‑zone framework gave me an immediate, visual way to discard choppy or lethargic charts without diving into complex volatility models.  
- By anchoring profit targets to a multiple of ADR% (e.g., 1.5× ADR), I could set realistic expectations that scale automatically with the instrument’s natural movement range.  
- I learned that the look‑back period is a lever: shortening it makes the ADR% more responsive to sudden volatility spikes, which can be useful during earnings season but may generate false signals in sideways markets.  
- Combining ADR% filtering with a simple moving‑average crossover improved my hit rate, as the volatility filter ensured I only traded instruments capable of sustaining the move indicated by the crossover.  
- Position sizing based on ADR%‑derived stop distances kept my risk per trade roughly constant across vastly different stocks, simplifying portfolio‑level risk management.  
- I observed that during periods of heightened market stress (e.g., major macro announcements), many stocks drifted into the “Excessive” zone, prompting me to either reduce position size or sit out until volatility normalized.  
- Finally, documenting the ADR% of each trade in a journal helped me retrospectively assess whether my sweet‑spot assumptions held true and refine the threshold ranges for my specific trading style.

## Cross-References
- [[finance]] – Swing trading is a subset of active investing within the broader finance domain; understanding market microstructure, liquidity, and risk concepts enhances ADR% application.  
- [[data-engineering]] – Building a reliable data pipeline to fetch, clean, and store OHLC data is foundational for calculating ADR% at scale.  
- [[software-engineering]] – Implementing the ADR% indicator as a reusable library or trading‑bot module requires sound software design, testing, and version control.  
- [[machine-learning]] – ADR% can serve as a feature in predictive models that forecast swing‑trade success probability or optimal holding period.  
- [[startup]] – Entrepreneurs building fintech tools or trading platforms may incorporate ADR%‑based scanners to differentiate their offerings.  
- [[health-wellness]] – Trading psychology is critical; recognizing when volatility zones shift helps manage stress and avoid overtrading during turbulent periods.  
- [[negotiation]] – While not directly related, the disciplined decision‑making process in swing trading parallels negotiation tactics: setting clear entry/exit criteria and sticking to them.  
- [[uncategorized]] – Any emerging alternative data sources (e.g., sentiment, news volatility) can be explored as adjuncts to ADR% for refining trade selection.

## Course Index
1. **Understanding ADR% Thresholds for Effective Swing Trading** (by @Gaurav_Cx10) — This course introduces the Average Daily Range expressed as a percentage (ADR%) as a volatility‑normalized metric for swing‑trade filtering. It explains how to calculate ADR%, interpret the four threshold zones (Low, Moderate/ Sweet Spot, High, Excessive), and integrate the indicator into a practical swing‑trading workflow that includes screening, technical confirmation, position sizing, and risk management.
