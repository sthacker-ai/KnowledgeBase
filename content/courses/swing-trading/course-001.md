---
title: "Understanding ADR% Thresholds for Effective Swing Trading"
source_id: "2070973240533766576"
source_type: "x_linked_source"
topic_slug: swing-trading
topic_label: "Swing Trading"
source_handle: "@Gaurav_Cx10"
tweet_url: "https://x.com/Gaurav_Cx10/status/2070973240533766576"
has_transcript: false
generated_at: "2026-07-06T06:11:16.299Z"
---
# Understanding ADR% Thresholds for Effective Swing Trading

## Overview
This course teaches traders how to use the Average Daily Range expressed as a percentage (ADR%) to filter and prioritize swing‑trade candidates. By mastering the ADR% scale presented by @Gaurav_Cx10, you will learn to identify charts that offer sufficient price movement for profitable swings while avoiding those that are too stagnant or excessively volatile. The material covers the definition of ADR%, its calculation, interpretation of the four threshold zones, and practical steps to integrate this metric into a swing‑trading workflow.

## Background & Context
Swing trading seeks to capture price moves that unfold over several days to weeks, relying on enough intraday volatility to generate meaningful profit potential while keeping risk manageable. Traders often look for proxies of volatility to gauge whether a security is likely to travel far enough within the holding period to justify the trade. The Average Daily Range (ADR) measures the average distance between a security’s high and low over a recent look‑back period, and expressing it as a percentage of the price (ADR%) normalizes this measure across different price levels. @Gaurav_Cx10’s tweet distills years of observation into a simple, actionable scale that helps swing traders quickly assess whether a chart’s volatility is in the “sweet spot” for momentum‑based entries. Although the example references the Indian equity market, the concept is universal and can be adapted to any liquid instrument. Understanding where ADR% fits within the broader toolkit—alongside moving averages, RSI, and volume analysis—enables traders to build a more robust, volatility‑aware swing‑trading system.

## Core Concepts

### What is ADR%?
ADR% stands for Average Daily Range expressed as a percentage of the security’s price. It is calculated by taking the average of the daily high‑low differences over a chosen look‑back window (commonly 10‑20 days) and dividing that average by the security’s current price, then multiplying by 100 to obtain a percentage. For example, if a stock’s average daily high‑low range over the past 14 days is ₹4 and its current price is ₹200, the ADR% equals (4 / 200) × 100 = 2%. This metric provides a normalized view of volatility that is comparable across stocks priced at ₹50, ₹500, or ₹5,000. Unlike raw ADR (which is in absolute price units), ADR% removes the bias that high‑priced securities naturally exhibit larger point ranges. Traders use ADR% to answer the question: “How much does this instrument typically move each day relative to its price level?”

### How to Calculate ADR%
1. **Select a look‑back period** – Most swing traders use 10 to 20 trading days; a 14‑day window balances responsiveness with stability.  
2. **Compute daily range** – For each day in the window, subtract the low from the high (High – Low).  
3. **Average the ranges** – Sum all daily ranges and divide by the number of days.  
4. **Normalize by price** – Divide the average range by the most recent closing price (or the average price over the window).  
5. **Convert to percentage** – Multiply the result by 100.  

In spreadsheet form, assuming column A holds highs, column B holds lows, and column C holds closing prices for the last 14 rows:  
```
= (AVERAGE(A2:A15 - B2:B15) / AVERAGE(C2:C15)) * 100
```
Many charting platforms (TradingView, Thinkorswim, AmiBroker) have built‑in ADR indicators; otherwise, the above formula can be implemented as a custom script.

### Interpreting the ADR% Threshold Zones
The tweet outlines four distinct zones:

- **<2% – “Dead”** – Even the cleanest chart lacks sufficient intraday movement to generate a worthwhile swing. Price tends to drift within a tight band, making it difficult to capture enough profit to overcome commissions and slippage.  
- **2‑3% – “Too slow for swing trading”** – The range is marginal; occasional swings may occur, but the expected profit per trade is often too small relative to risk. Traders may still consider these setups only if other strong signals (e.g., breakout from a consolidation) are present.  
- **3‑5% – “Workable zone”** – This is the typical range for many Indian equities. Price moves enough to allow a swing trader to target a 1‑2% profit target with a reasonable stop‑loss, yielding a favorable risk‑reward ratio.  
- **5‑8% – “Sweet spot for momentum”** – Higher volatility fuels stronger trending moves. When combined with momentum indicators (e.g., rising RSI, MACD crossover), these securities can deliver larger swings, though they also demand wider stops and tighter position sizing to manage increased risk.

These zones are not rigid boundaries; they serve as heuristics that guide initial screening. Traders may adjust the cut‑offs based on their own risk tolerance, time horizon, and the specific asset class they trade.

### Application in Swing Trading
In practice, ADR% is used as a **pre‑trade filter** rather than a standalone entry signal. A typical workflow:  
1. **Screen** the watchlist for securities whose ADR% falls within the 3‑8% band (excluding the <2% dead zone and being cautious of >8% which may signal excessive volatility).  
2. **Rank** candidates by ADR% – higher values within the sweet spot may be prioritized for momentum‑based strategies, while those near the lower end of the workable zone may suit mean‑reversion or range‑bound approaches.  
3. **Confirm** with additional technicals (trend direction, support/resistance, volume) before entering.  
4. **Set trade parameters** – Profit targets often range from 0.5× to 1× the ADR% (e.g., if ADR% = 4%, aim for a 2‑4% price move). Stop‑losses are commonly placed at 0.5× ADR% below entry for longs (or above for shorts) to give the trade room to breathe.  
5. **Monitor** – If ADR% expands significantly after entry, consider trailing the stop to lock in gains; if it contracts, the trade may be losing momentum and could be exited early.

### Market‑Specific Considerations (Indian Market Context)
The tweet notes that in the Indian market, most securities naturally exhibit ADR% in the 3‑5% range. This reflects the typical volatility of large‑cap and mid‑cap stocks on the NSE and BSE, where daily price swings of 1‑3% are common. Traders focusing on Indian equities should therefore expect the majority of their scan results to land in the “workable zone.” To find the “sweet spot” (5‑8%), one may need to look at smaller‑cap stocks, sector‑specific leaders during earnings season, or indices futures that exhibit higher intraday volatility. Conversely, large‑cap blue‑chip stocks often stay below 3%, requiring traders to either accept smaller profit targets or employ leverage (e.g., futures) to amplify returns while managing risk.

## How It Works / Step-by-Step
Below is a detailed, step‑by‑step guide to incorporating ADR% into a swing‑trading routine, illustrated with a hypothetical Indian stock, **ABC Ltd.**  

**Step 1 – Data Collection**  
Gather the last 14 trading days of high, low, and close prices for ABC Ltd. from your data provider or charting platform.  

**Step 2 – Compute Daily Ranges**  
For each day, calculate High – Low. Suppose the ranges (in ₹) are: 2.1, 2.5, 1.9, 2.3, 2.0, 2.4, 2.2, 2.6, 2.1, 2.3, 2.0, 2.5, 2.2, 2.4.  

**Step 3 – Average the Ranges**  
Sum = 32.5; Average = 32.5 / 14 ≈ 2.32₹.  

**Step 4 – Normalize by Price**  
Assume the most recent closing price is ₹115.  
ADR = 2.32 / 115 = 0.0202.  

**Step 5 – Convert to Percentage**  
ADR% = 0.0202 × 100 ≈ 2.02%.  

**Step 6 – Locate ADR% on the Scale**  
At 2.02%, ABC Ltd. falls just above the <2% “dead” threshold but still in the 2‑3% “too slow” zone. Based on the scale, this stock would be a low‑priority swing candidate unless other strong signals appear (e.g., a bullish engulfing pattern at a key support level).  

**Step 7 – Adjust Scan Criteria**  
If you are seeking momentum trades, raise the minimum ADR% to 4%. Re‑run the scan; stocks that now appear might include XYZ Ltd. with an ADR% of 5.6% (sweet spot) or PQR Ltd. with 3.8% (workable zone).  

**Step 8 – Position Sizing**  
For a chosen stock with ADR% = 5.6% and a price of ₹250, the average daily range in rupees is 0.056 × 250 = ₹14.  
If you desire a stop‑loss of half the ADR, set it at ₹7 below entry.  
If you aim for a profit target equal to the full ADR, set it at ₹14 above entry.  

**Step 9 – Execute and Manage**  
Enter the trade after confirming a bullish setup (e.g., price above the 20‑day EMA with rising volume). Place the stop‑loss and target as calculated. Monitor the trade; if the price moves favorably and ADR% expands, consider trailing the stop to lock in gains.  

**Step 10 – Review**  
After the trade closes, record the actual price move relative to the ADR%‑based target and stop. Use this feedback to refine your ADR% thresholds or position‑sizing rules for future trades.

## Real-World Examples & Use Cases

### Example 1 – Scanning for Momentum Stocks in the Nifty 500
A trader wants to capture short‑term momentum moves lasting 3‑5 days. They run a daily scan across the Nifty 500 universe, filtering for:  
- ADR% between 5% and 8% (sweet spot)  
- Price above the 20‑day EMA  
- RSI > 55 but < 70 (to avoid overbought extremes)  
- Volume > 1.5× the 20‑day average volume  

The scan yields 12 candidates. The trader ranks them by ADR% (highest first) and examines the top three:  
- **Stock A** (ADR% = 6.2%, price ₹420) → average daily range ≈ ₹26.  
- **Stock B** (ADR% = 5.9%, price ₹185) → average daily range ≈ ₹10.9.  
- **Stock C** (ADR% = 5.5%, price ₹310) → average daily range ≈ ₹17.1.  

Using half‑ADR stops and full‑ADR targets, the trader sets up trades with risk‑reward ratios roughly 1:1, adjusting position size so that each trade risks no more than 1% of equity. Over a month, the trader captures several 4‑6% moves, validating the sweet‑spot hypothesis.

### Example 2 – Avoiding Dead Zones in Low‑Volatility Large‑Caps
A swing trader focusing on Nifty 50 large‑caps notices that many of their usual picks (e.g., HDFC Bank, Reliance Industries) consistently show ADR% below 2.5%. Applying the <2% dead‑zone rule, they exclude these names from pure swing‑trade consideration. Instead, they allocate capital to:  
- **Futures contracts** on the same underlyings (which effectively amplify the ADR% through leverage)  
- **Sector ETFs** with higher constituent volatility (e.g., Nifty Bank ETF)  
- **Options strategies** (e.g., buying short‑dated calls) that profit from even small moves when combined with leverage  

By recognizing the dead zone, the trader avoids frustration from trades that repeatedly hit tight stops or fail to reach meaningful profit targets.

### Example 3 – Adapting the Scale for Cryptocurrency Swing Trading
A trader who trades Bitcoin on a 4‑hour chart adapts the ADR% scale to the crypto market’s higher volatility. They compute a 10‑day ADR% and find that Bitcoin typically shows ADR% between 8% and 15%. Using the same logical mapping:  
- **<4%** → dead (rare, occurs during prolonged consolidation)  
- **4‑6%** → too slow for meaningful swing  
- **6‑10%** → workable zone (typical range for BTC)  
- **10‑18%** → sweet spot for momentum (often seen during news‑driven spikes)  

This adaptation lets the trader apply the same heuristic framework while respecting the distinct volatility characteristics of digital assets.

## Key Insights & Takeaways
- ADR% normalizes daily price range, enabling fair volatility comparison across securities of different price levels.  
- The <2% zone indicates insufficient intraday movement for profitable swing trades; avoid or treat as dead.  
- The 2‑3% zone offers marginal movement; consider only when supported by strong complementary signals.  
- The 3‑5% zone is the typical workable range for many Indian equities, providing adequate swing potential with manageable risk.  
- The 5‑8% zone represents the sweet spot for momentum‑based swings, delivering larger moves but requiring wider stops and disciplined position sizing.  
- ADR% should be used as a pre‑trade filter, not as a standalone entry signal; combine with trend, momentum, and volume analysis.  
- Position sizing based on a fraction of ADR% (e.g., 0.5× for stop, 1× for target) helps align risk with the instrument’s natural volatility.  
- Market context matters: Indian large‑caps often sit in the workable zone, while small‑caps or sector‑specific leaders may reach the sweet spot.  
- Traders can adapt the ADR% thresholds to other asset classes (futures, crypto, forex) by recalibrating the zones to reflect typical volatility levels.  
- Regularly reviewing actual trade outcomes versus ADR%‑based expectations refines the thresholds and improves the robustness of the swing‑trading system.

## Common Pitfalls / What to Watch Out For
- **Overreliance on ADR% alone**: Using ADR% as the sole criterion can lead to entering trades in choppy, sideways markets that satisfy the volatility filter but lack directional bias. Always confirm with trend or momentum indicators.  
- **Misinterpreting the “dead” zone**: A security with ADR% <2% may still present viable swing opportunities if it is poised for a breakout (e.g., after a tight consolidation). Treat the <2% rule as a guideline, not an absolute prohibition.  
- **Ignoring changes in volatility regime**: ADR% is based on a historical look‑back; sudden spikes (e.g., due to earnings news) can render the historical average obsolete, causing stops to be too tight or targets too conservative. Re‑calculate ADR% frequently or use a shorter look‑back during volatile periods.  
- **Applying the same thresholds across vastly different instruments**: The 3‑5% workable zone is specific to Indian equities; applying it to forex pairs (which often have ADR% <1%) would eliminate all candidates. Adjust the zones to match the asset class’s typical volatility.  
- **Over‑leveraging in the sweet spot**: Higher ADR% invites larger position sizes to maintain the same rupee risk, but excessive leverage can amplify losses if the move reverses quickly. Keep leverage within your overall risk management framework.  
- **Neglecting slippage and commissions**: In low‑price stocks where ADR% translates to small absolute moves, transaction costs can erode profits. Ensure that the expected move (in rupees) substantially exceeds total costs.  
- **Failing to adjust for liquidity**: Securities with high ADR% but low average daily volume may experience large price impact when entering or exiting, distorting the effective range. Always verify sufficient liquidity before trading.  
- **Using inconsistent price for normalization**: Some traders normalize by the closing price, others by the average of high‑low‑close. Inconsistent application leads to incomparable ADR% values across scans. Standardize the method across your screening process.  
- **Assuming linearity of risk‑reward**: Setting stop‑loss and target at fixed fractions of ADR% assumes symmetric volatility, which is not always true (e.g., gaps, news‑driven spikes). Consider asymmetric stops or volatility‑adjusted trailing stops.  
- **Over‑trading based on frequent ADR% fluctuations**: ADR% can vary day‑to‑day; reacting to every minor change can cause excessive churn. Use a smoothed ADR% (e.g., an exponential moving average of the raw ADR%) to reduce noise.

## Review Questions
1. Explain why ADR% is a more useful volatility filter than raw ADR when comparing securities priced at different levels, and illustrate your answer with a numerical example involving two stocks priced at ₹50 and ₹500.  
2. Describe a complete step‑by‑step process for scanning a watchlist for swing‑trade candidates using the ADR% scale, including how you would set stop‑loss and profit‑loss levels based on the calculated ADR%.  
3. A trader observes that a particular stock has an ADR% of 1.8% over the past 20 days but is trading near a strong support level with a bullish candlestick pattern. According to the ADR% scale presented, what is the appropriate action, and how might the trader justify taking a trade despite the low ADR%?  

## Further Learning
- Study the relationship between ADR% and Average True Range (ATR%) to understand how incorporating gaps affects volatility measurement.  
- Explore volatility‑based position sizing models such as the Kelly criterion or fixed fractional ATR methods to refine risk management beyond simple half‑ADR stops.  
- Investigate how regime‑shifting volatility models (e.g., GARCH, Markov‑Switching) can be used to dynamically adjust ADR% look‑back periods in response to changing market conditions.  
- Examine case studies of swing‑trading strategies in futures markets where ADR% is applied to contract specifications, taking into account point value and tick size.  
- Read academic literature on the predictive power of intraday range measures for short‑term price continuation and reversal patterns.
