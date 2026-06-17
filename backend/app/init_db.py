from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app import models
import uuid

def init_database():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(models.DBSite).first():
        db.close()
        return

    print("Seeding SQLite Database with CoreText Executive OS datasets...")

    # Seed User Settings
    settings = models.DBUserSettings(
        director_name="Alexander Vance",
        shareholder_posture="Aggressive Compounder",
        openai_api_key="",
        anthropic_api_key="",
        auto_execute_tier1=True,
        auto_execute_tier2=True,
        email_briefing_time="07:00 AM"
    )
    db.add(settings)

    # Seed 3 Sites
    site_fintech = models.DBSite(
        id="site_fintech",
        name="FinTech Compounder",
        niche="Personal Finance & WealthTech",
        url="https://fintechcompounder.com",
        asset_value="$485,000",
        monthly_revenue="$14,250",
        revenue_growth="+18.4%",
        topical_authority_score=92,
        geo_visibility_score=84,
        predictive_health_score=96,
        layer3_memory={
            "posture": "Data-driven institutional analysis adapted for high-earning professionals (HENRYs).",
            "primary_audience": "Tech workers, doctors, lawyers making $150k-$400k looking to optimize taxes and passive assets.",
            "tone": "Authoritative, slightly skeptical of financial jargon, highly exact with tax codes.",
            "topical_clusters": ["Algorithmic Tax Harvesting", "High-Yield Cash Vaults", "Private Equity Platforms", "Crypto Staking Yields"],
            "monetization_rules": ["Only promote SEC-registered or SIPC-insured platforms", "Minimum $150 CPA or 30% RevShare", "Inject custom ROI calculators in all review pillars"]
        }
    )

    site_biohack = models.DBSite(
        id="site_biohack",
        name="Longevity & Biohacking Lab",
        niche="Human Optimization & Anti-Aging",
        url="https://longevitybiohack.com",
        asset_value="$310,000",
        monthly_revenue="$9,820",
        revenue_growth="+24.1%",
        topical_authority_score=88,
        geo_visibility_score=91,
        predictive_health_score=92,
        layer3_memory={
            "posture": "Peer-reviewed science translated into executable daily protocols.",
            "primary_audience": "Founders, executives, and biohackers aged 30-55 investing in healthspan.",
            "tone": "Clinical yet conversational, heavily citing PubMed articles and clinical trials.",
            "topical_clusters": ["NAD+ Precursors", "Continuous Glucose Monitoring", "Mitochondrial Restoration", "Deep Sleep Architecture"],
            "monetization_rules": ["Only recommend third-party lab tested supplements", "High recurring affiliate lifetime commissions", "Offer premium private longevity newsletter"]
        }
    )

    site_saas = models.DBSite(
        id="site_saas",
        name="AI Workflows & SaaS B2B",
        niche="B2B Software & Autonomous Agents",
        url="https://aisaasworkflows.com",
        asset_value="$620,000",
        monthly_revenue="$21,400",
        revenue_growth="+31.6%",
        topical_authority_score=95,
        geo_visibility_score=89,
        predictive_health_score=98,
        layer3_memory={
            "posture": "Enterprise-grade automation playbooks and deep-dive technical software comparisons.",
            "primary_audience": "Directors of Operations, Chief AI Officers, RevOps leaders looking to cut headcount costs.",
            "tone": "Pragmatic, highly structural, focused on exact hours saved and ROI metrics.",
            "topical_clusters": ["Autonomous Agent Orchestration", "LLM Evaluation Frameworks", "CRM AI Injection", "No-Code Data Pipelines"],
            "monetization_rules": ["High ticket B2B SaaS referrals (PartnerStack/Impact)", "Focus on yearly billing CPAs", "Sell $499 premium agent blueprint templates"]
        }
    )
    db.add_all([site_fintech, site_biohack, site_saas])

    # Seed Layer 2 Niche Data
    l2_fintech = models.DBLayer2Niche(
        site_id="site_fintech",
        industry_velocity="High Competitive Pressure",
        algorithm_weather="Google June 2026 Core Shift prioritizing interactive calculators and verified author credentials over plain text tables.",
        geo_ai_highlights=[
            "Perplexity Pro is now citing 'FinTech Compounder' in 42% of queries regarding 'Automated Tax Loss Harvesting'.",
            "ChatGPT Search answers heavily reward bulleted executive summaries with specific APY historical percentages."
        ],
        emerging_topic_clusters=[
            {"cluster": "AI-Driven Direct Indexing", "growth": "+310%", "window": "3 Weeks to Dominate", "comp_level": "Low"},
            {"cluster": "Treasury Bill Ladder Automations", "growth": "+185%", "window": "4 Weeks", "comp_level": "Medium"},
            {"cluster": "Cross-Border Digital Nomad Banking", "growth": "+240%", "window": "2 Weeks", "comp_level": "Low"}
        ]
    )

    l2_biohack = models.DBLayer2Niche(
        site_id="site_biohack",
        industry_velocity="Rapid Breakthrough Phase",
        algorithm_weather="Claude 3.5/3.7 Sonnet & ChatGPT answers heavily penalizing health claims without DOI/PubMed hyperlink anchors.",
        geo_ai_highlights=[
            "Claude Artifact generation queries for 'Morning Supplement Stack' frequently pull our dosage comparison matrices.",
            "Significant migration of health search traffic from Google Search to Perplexity & YouTube Audio."
        ],
        emerging_topic_clusters=[
            {"cluster": "Urolithin A Muscle Mitophagy", "growth": "+420%", "window": "2 Weeks to Dominate", "comp_level": "Low"},
            {"cluster": "Peptide Therapy Micro-Dosing (BPC-157/TB-500)", "growth": "+290%", "window": "Critical (1 Week)", "comp_level": "High"},
            {"cluster": "Non-Invasive Vagus Nerve Stimulation", "growth": "+175%", "window": "4 Weeks", "comp_level": "Low"}
        ]
    )

    l2_saas = models.DBLayer2Niche(
        site_id="site_saas",
        industry_velocity="Extreme Velocity",
        algorithm_weather="AI Overviews (Google SGE) triggering on 89% of 'X vs Y software' keywords. Traditional organic ranking CTR dropped by 14%.",
        geo_ai_highlights=[
            "ChatGPT Search queries for 'Best open source multi-agent frameworks' rank our GitHub repo teardowns #1.",
            "LinkedIn viral reposts are driving 40% more buyer intent than Google organic search."
        ],
        emerging_topic_clusters=[
            {"cluster": "Local LLM Privacy RAG Deployments", "growth": "+580%", "window": "Urgent (7 Days)", "comp_level": "Medium"},
            {"cluster": "Voice AI Outbound Calling Agents", "growth": "+410%", "window": "2 Weeks", "comp_level": "High"},
            {"cluster": "Browser Automation Swarms", "growth": "+260%", "window": "3 Weeks", "comp_level": "Low"}
        ]
    )
    db.add_all([l2_fintech, l2_biohack, l2_saas])

    # Seed Health Forecasts
    hf_fintech = models.DBHealthForecast(
        site_id="site_fintech",
        crawl_budget_status="Optimal",
        crawl_budget_text="Googlebot crawl frequency increased 12% on Pillar Tax cluster. Zero index drop-offs predicted.",
        ctr_micro_status="Action Required",
        ctr_micro_text="Pillar 'Best Robo Advisors 2026' experiencing 1.8% CTR micro-dip in SERP positions 2-3. Title tag fatigue predicted in 14 days.",
        seasonality_text="Q3 Estimated Tax payment surge incoming in July. Highly recommended to deploy 4 planned pre-emptive tax calculation guides.",
        competitor_site="NerdWallet / Bankrate",
        competitor_text="Bankrate launched 6 automated pages around 'Direct Indexing'. We have a 18-day head start on the deep-dive comparative framework."
    )

    hf_biohack = models.DBHealthForecast(
        site_id="site_biohack",
        crawl_budget_status="Warning",
        crawl_budget_text="Crawl allocation shifted heavily away from archive sleep articles towards new Peptide cluster. Schema re-indexing queued.",
        ctr_micro_status="Optimal",
        ctr_micro_text="Organic CTR up 4.2% across 'NAD+ Injection' terms due to updated EEAT author clinical review badges.",
        seasonality_text="Peak summer athletic performance search curve peaking. Focus on hydration and recovery electrolytes.",
        competitor_site="Examine.com / Huberman Hub",
        competitor_text="Competitor published deep dive on Urolithin A. Our article has 24 more clinical citations and an interactive dosage calculator."
    )

    hf_saas = models.DBHealthForecast(
        site_id="site_saas",
        crawl_budget_status="Optimal",
        crawl_budget_text="Sub-second HTML load times ensuring 100% real-time indexation by OpenAI Bot and Google AI Overviews scraper.",
        ctr_micro_status="Action Required",
        ctr_micro_text="'AI CRM Comparison' CTR down 2.1%. Reason: Users seeking pricing tables directly in meta descriptions.",
        seasonality_text="B2B enterprise budget planning cycle for Q4 begins in August. Queueing ROI justification whitepapers.",
        competitor_site="G2 / Capterra / Zapier Blog",
        competitor_text="Zapier blog heavily targeting 'AI Agent Orchestration'. We have superior code-level developer teardowns."
    )
    db.add_all([hf_fintech, hf_biohack, hf_saas])

    # Seed Decisions Queue
    decisions = [
        models.DBDecisionItem(id="t1_1", site_id="site_fintech", tier="tier1", action="Fix Broken Internal Links (14 URLs detected)", detail="Redirecting 14 outdated 404 links to active pillar pages.", confidence="99.8%", status="Executed Autonomous", time="03:42 AM"),
        models.DBDecisionItem(id="t1_2", site_id="site_fintech", tier="tier1", action="Update Article Date Stamps & Microdata", detail="Refreshed 28 dynamic tax rate tables with current IRS monthly figures.", confidence="99.5%", status="Executed Autonomous", time="04:15 AM"),
        models.DBDecisionItem(id="t1_3", site_id="site_fintech", tier="tier1", action="Inject Missing Alt Text on 22 Financial Charts", detail="Added ADA-compliant and SEO-rich descriptions to all Q2 charts.", confidence="99.1%", status="Executed Autonomous", time="05:01 AM"),
        models.DBDecisionItem(id="t2_1", site_id="site_fintech", tier="tier2", action="Refresh Statistics in 'Private Equity Yields'", detail="Updated BlackRock and KKR Q1 2026 performance numbers.", confidence="94.2%", status="Executed & Notified", time="06:30 AM", impact="+2 Rank Positions"),
        models.DBDecisionItem(id="t2_2", site_id="site_fintech", tier="tier2", action="Inject FAQ Cluster for AI Overviews", detail="Added 5 structured QA schema blocks to 'High-Yield Cash Vaults' post.", confidence="96.7%", status="Executed & Notified", time="06:45 AM", impact="SGE Featured Snippet Secured"),
        models.DBDecisionItem(id="t3_1", site_id="site_fintech", tier="tier3", action="Deploy New Content Cluster: AI Direct Indexing", detail="Invest in 8 highly structured articles to capture 3,400 monthly high-buyer searches before competitor saturation.", return_est="$2,800/mo Return", cost_est="$0 / 4 AI Agent Hrs", status="Pending Decision"),
        models.DBDecisionItem(id="t3_2", site_id="site_fintech", tier="tier3", action="Restructure Pillar Internal Links (WealthTech Hub)", detail="Rebalance link juice from generic retirement posts directly to high-converting Private Equity reviews.", return_est="+34% Affiliate Conversions", cost_est="$0 / Autonomous", status="Pending Decision"),
        models.DBDecisionItem(id="t4_1", site_id="site_fintech", tier="tier4", action="Strategic Site Pivot: Launch Interactive Advisory Tools", detail="Shift 30% of editorial focus from plain informational articles to building embeddable JavaScript tax & investment calculators.", strategic_risk="High Stakes / High Reward", discussion_prompt="Should we hire a specialized React widget builder or deploy autonomous Claude Artifact widgets?", status="Needs Human Discussion"),
        
        models.DBDecisionItem(id="tb1_1", site_id="site_biohack", tier="tier1", action="Auto-repair PubMed external link anchors (6 resolved)", detail="Updated updated DOI reference links to active National Library of Medicine endpoints.", confidence="99.9%", status="Executed Autonomous", time="02:10 AM"),
        models.DBDecisionItem(id="tb2_1", site_id="site_biohack", tier="tier2", action="Add MD Medical Reviewer Structured Data", detail="Attached Dr. Marcus Vance verified review credentials to 14 high-traffic anti-aging pillar pages.", confidence="95.4%", status="Executed & Notified", time="06:12 AM", impact="+18% EEAT Trust Score"),
        models.DBDecisionItem(id="tb3_1", site_id="site_biohack", tier="tier3", action="Invest in Topic Cluster: Urolithin A & Muscle Longevity", detail="Deploy 6 authoritative clinical breakdowns targeting $85 AOV recurring affiliate supplements.", return_est="$4,100/mo Recurring", cost_est="6 AI Agent Hrs", status="Pending Decision"),
        models.DBDecisionItem(id="tb4_1", site_id="site_biohack", tier="tier4", action="Launch Premium Paid Longevity Protocol Membership", detail="Paywall our quarterly biohacking spreadsheet protocols for $19/mo on Stripe.", strategic_risk="High / Community Reaction", discussion_prompt="Will paywalling our deep protocols hurt top-of-funnel Perplexity AI discovery?", status="Needs Human Discussion"),

        models.DBDecisionItem(id="ts1_1", site_id="site_saas", tier="tier1", action="Auto-update Software Pricing Meta Descriptions", detail="Refreshed HubSpot and Salesforce updated 2026 pricing tiers across 40 review snippets.", confidence="99.6%", status="Executed Autonomous", time="01:30 AM"),
        models.DBDecisionItem(id="ts2_1", site_id="site_saas", tier="tier2", action="Atomize Core AI CRM Guide to LinkedIn Carousel", detail="Generated 10-slide PDF carousel and queued for posting on CEO's professional profile.", confidence="97.1%", status="Executed & Notified", time="07:00 AM", impact="2,400 Projected B2B Impressions"),
        models.DBDecisionItem(id="ts3_1", site_id="site_saas", tier="tier3", action="Deploy Local LLM RAG Enterprise Cluster", detail="Produce 10 highly technical implementation guides for CTOs with embedded HubSpot lead capture magnets.", return_est="$8,500/mo Pipeline Value", cost_est="12 AI Agent Hrs", status="Pending Decision"),
        models.DBDecisionItem(id="ts4_1", site_id="site_saas", tier="tier4", action="Build & Monetize Autonomous Agent Template Store", detail="Transition site from just affiliate software reviews to selling downloaded n8n and LangChain JSON workflows.", strategic_risk="Game Changer", discussion_prompt="How do we handle customer support when platform APIs break our downloaded workflow templates?", status="Needs Human Discussion")
    ]
    db.add_all(decisions)

    # Seed Content Portfolios
    portfolios = [
        models.DBContentPortfolio(id="cp_ft_1", site_id="site_fintech", title="The Ultimate Guide to AI Direct Indexing in 2026", cluster="AI-Driven Direct Indexing", demand_score=94, geo_score=96, monetization_score=98, comp_gap_score=91, authority_fit=95, time_to_result="14 Days", opp_score=95, proj_revenue="$3,200 /mo", monetization_type="Wealthfront / Betterment Enterprise Affiliates ($200 CPA)", status="Ready for Atomized Deployment", atomized_channels=["Google SGE", "Perplexity Citation", "Newsletter Deep Dive", "4 LinkedIn Hooks", "Twitter/X Thread", "Podcast Outline"]),
        models.DBContentPortfolio(id="cp_ft_2", site_id="site_fintech", title="Automated Tax Loss Harvesting: Algorithmic Alpha", cluster="Algorithmic Tax Harvesting", demand_score=89, geo_score=92, monetization_score=95, comp_gap_score=84, authority_fit=98, time_to_result="21 Days", opp_score=92, proj_revenue="$2,400 /mo", monetization_type="Custom High-Ticket Advisory Leads", status="Published & Compounding", atomized_channels=["Google Search", "AI Overviews", "Newsletter Deep Dive", "YouTube Script"]),
        models.DBContentPortfolio(id="cp_ft_3", site_id="site_fintech", title="Top 5 High-Yield Cash Vaults for Business Reserves", cluster="High-Yield Cash Vaults", demand_score=88, geo_score=89, monetization_score=96, comp_gap_score=82, authority_fit=91, time_to_result="10 Days", opp_score=89, proj_revenue="$4,500 /mo", monetization_type="Mercury / Brex Revshare", status="In Autonomous Brief Generation", atomized_channels=["Google Search", "LinkedIn B2B Post", "Twitter/X Thread"]),
        models.DBContentPortfolio(id="cp_bh_1", site_id="site_biohack", title="Urolithin A vs NMN: Which Reverses Cellular Aging Faster?", cluster="Mitochondrial Restoration", demand_score=96, geo_score=98, monetization_score=94, comp_gap_score=92, authority_fit=96, time_to_result="12 Days", opp_score=96, proj_revenue="$3,800 /mo", monetization_type="Timeline Nutrition RevShare", status="Ready for Atomized Deployment", atomized_channels=["Perplexity Citation", "ChatGPT Source", "Instagram Carousel Hook", "YouTube Script Outline", "Newsletter Deep Dive"]),
        models.DBContentPortfolio(id="cp_ss_1", site_id="site_saas", title="Evaluating Open Source Multi-Agent Frameworks (LangGraph vs CrewAI vs AutoGen)", cluster="Autonomous Agent Orchestration", demand_score=98, geo_score=99, monetization_score=95, comp_gap_score=94, authority_fit=99, time_to_result="7 Days", opp_score=98, proj_revenue="$7,600 /mo", monetization_type="Enterprise Cloud Hosting & Autonomous Workflow Template Sales", status="Ready for Atomized Deployment", atomized_channels=["GitHub Citation", "Perplexity Pro Deep Answer", "LinkedIn Multi-slide Teardown", "YouTube Technical Walkthrough", "Dev.to Cross-Post"])
    ]
    db.add_all(portfolios)

    # Seed Geo Visibility
    geo_vis = [
        models.DBGeoEngineVisibility(site_id="site_fintech", chatgpt={"share": "38%", "status": "Strong Citation Frequency", "pattern": "Prefers highly exact markdown comparative tables with bolded tax codes."}, perplexity={"share": "52%", "status": "Dominant Position", "pattern": "Rewards authoritative numerical bullet points and expert quote blocks."}, claude={"share": "10%", "status": "Untapped Growth", "pattern": "Favors long-form conceptual frameworks and interactive financial math scripts."}),
        models.DBGeoEngineVisibility(site_id="site_biohack", chatgpt={"share": "45%", "status": "Excellent Visibility", "pattern": "Prefers clear supplement dosage timing bullet points."}, perplexity={"share": "42%", "status": "Excellent Visibility", "pattern": "Strictly requires PubMed PMCID numbers referenced in square brackets."}, claude={"share": "13%", "status": "Growing", "pattern": "Loves mechanism-of-action cellular biology explanations."}),
        models.DBGeoEngineVisibility(site_id="site_saas", chatgpt={"share": "61%", "status": "Superb Visibility", "pattern": "Highly responsive to copy-pasteable configuration JSON snippets."}, perplexity={"share": "31%", "status": "Good Visibility", "pattern": "Pulls operational cost savings estimates directly from text summaries."}, claude={"share": "8%", "status": "Action Needed", "pattern": "Prefers comprehensive system architecture diagrams and ASCII flowcharts."})
    ]
    db.add_all(geo_vis)

    # Seed Geo Baits & Audits
    geo_baits = [
        models.DBGeoBait(id="geo_1", site_id="site_fintech", query_target="What is the exact mathematical yield formula for direct indexing tax alpha?", bait_structure="A 4-step highly structured mathematical proof block formatted in KaTeX/Markdown with exact IRS Rule 561 citations.", projected_ai_picks="Estimated 1,400 monthly AI engine citations", status="Deploy AI Answer Bait"),
        models.DBGeoBait(id="geo_2", site_id="site_fintech", query_target="Compare top 3 high-yield corporate cash accounts with FDIC sweep networks.", bait_structure="A multi-column exact JSON & Markdown data table with daily verified APY timestamps.", projected_ai_picks="Estimated 2,200 monthly AI engine citations", status="Deploy AI Answer Bait"),
        models.DBGeoBait(id="geo_bh_1", site_id="site_biohack", query_target="What is the clinical protocol for Urolithin A 500mg daily bio-availability?", bait_structure="Structured clinical dosage timeline block with explicit liposomal absorption charts.", projected_ai_picks="Estimated 1,900 monthly AI engine citations", status="Deploy AI Answer Bait")
    ]
    db.add_all(geo_baits)

    geo_audits = [
        models.DBGeoAudit(id="ga_1", site_id="site_fintech", article_title="Crypto Staking Taxes in 2026: Complete IRS Guide", current_geo_score=62, defect="Missing clear direct definition paragraphs at top of page. AI scrapers skipping to competitor pages.", remediation="Inject AI-Optimized 'TL;DR Executive Summary Block' with structured QA schema.", ctb_action="Upgrade Article for AI Engine Citability"),
        models.DBGeoAudit(id="ga_2", site_id="site_biohack", article_title="Best NAD+ Booster Supplements 2026", current_geo_score=71, defect="Lack of specific third-party Certificate of Analysis (CoA) structured data.", remediation="Add verified lab test badge schema and structured purity tables.", ctb_action="Upgrade Article for AI Engine Citability")
    ]
    db.add_all(geo_audits)

    # Seed Preemptive Decay Items
    decays = [
        models.DBDecayItem(id="dec_1", site_id="site_fintech", title="Best Dividend Kings to Hold for Life", last_updated="8 Months Ago", decay_prob_score="88%", projected_decay_date="14 Days (Early July)", action_type="Quick Refresh", reason="3 companies announced abnormal Q2 dividend hikes. P/E ratios are stale.", auto_refresh_brief="Update 3 dividend yield figures, refresh P/E multipliers, and add 1-paragraph summary on inflationary headwinds.", cost_est="$0 / Autonomous Execution"),
        models.DBDecayItem(id="dec_2", site_id="site_fintech", title="Complete Review of BlockFi & Celsius Crypto Yields", last_updated="18 Months Ago", decay_prob_score="99%", projected_decay_date="Immediate Warning", action_type="Retirement & Redirect", reason="Platforms are obsolete/bankrupt. High brand damage if left live.", auto_refresh_brief="Insert prominent top banner explaining bankruptcy, execute 301 permanent redirect to 'Secure Cold Storage Treasury Vaults'.", cost_est="$0 / Autonomous Execution"),
        models.DBDecayItem(id="dec_bh_1", site_id="site_biohack", title="Optimizing Deep Sleep with Blue Light Blocking Glasses", last_updated="11 Months Ago", decay_prob_score="82%", projected_decay_date="21 Days", action_type="Quick Refresh", reason="New Stanford 2026 study published showing morning sunlight viewing is 3x more impactful than evening blocking.", auto_refresh_brief="Inject new Stanford research section at the top, adjust headline to reflect circadian anchoring.", cost_est="$0 / Autonomous Execution"),
        models.DBDecayItem(id="dec_ss_1", site_id="site_saas", title="Top 10 AI Copywriting Tools (Jasper vs Copy.ai)", last_updated="6 Months Ago", decay_prob_score="95%", projected_decay_date="Urgent (7 Days)", action_type="Full Rebuild", reason="Basic AI copywriting wrappers are entirely dead. Market moved to autonomous marketing research swarms.", auto_refresh_brief="Complete rewrite reframing tools from 'writing assistants' to 'multi-agent editorial teams'.", cost_est="5 AI Agent Hrs")
    ]
    db.add_all(decays)

    # Seed Monetization Items
    rev_attrs = [
        models.DBRevenueAttribution(id="ra_1", site_id="site_fintech", title="Top 5 High-Yield Cash Vaults", visits="4,200 /mo", current_rev="$4,500 /mo", rpm="$1,071", intent="Commercial Buyer", actionable_gap="Add direct Brex institutional comparison to unlock added $1,200/mo."),
        models.DBRevenueAttribution(id="ra_2", site_id="site_fintech", title="Algorithmic Tax Harvesting Alpha", visits="6,800 /mo", current_rev="$2,400 /mo", rpm="$352", intent="Informational Premium", actionable_gap="Capture high net worth reader emails with a 'Custom Tax Audit Checklist'."),
        models.DBRevenueAttribution(id="ra_bh", site_id="site_biohack", title="Urolithin A Clinical Teardown", visits="3,900 /mo", current_rev="$3,800 /mo", rpm="$974", intent="High Commercial", actionable_gap="Add one-click premium subscription bundle option.")
    ]
    db.add_all(rev_attrs)

    mon_recs = [
        models.DBMonetizationRecommendation(id="mr_1", site_id="site_fintech", rec_type="Untapped Affiliate Injection", target_article="Evaluating Municipal Bond Yields in High Tax States", traffic="3,100 visits /mo", current_revenue="$0 /mo", recommendation="Inject Public.com T-Bill & Municipal Bond automated account referral link ($150 CPA).", value_creation="Projected $1,350 /mo immediate new recurring profit.", ctb="Capture $1,350/mo Municipal Bond Affiliate Gap"),
        models.DBMonetizationRecommendation(id="mr_2", site_id="site_fintech", rec_type="Digital Product Creation Opportunity", target_article="Self-Directed Solo 401(k) Mega Backdoor Blueprint", traffic="2,800 visits /mo", current_revenue="$400 /mo", recommendation="Build and sell an automated downloadable Excel Solopreneur Tax Optimizer spreadsheet for $149.", value_creation="Projected $3,800 /mo pure margin digital product revenue.", ctb="Deploy $149 Solo 401(k) Excel Product Suite"),
        models.DBMonetizationRecommendation(id="mr_ss", site_id="site_saas", rec_type="High-Ticket Lead Selling", target_article="Complete Guide to Enterprise RAG Security", traffic="2,100 Enterprise CTO visits /mo", current_revenue="$800 /mo", recommendation="Deploy interactive lead capture qualifying form and route B2B implementation contracts directly to our approved partner agencies at $300 per verified lead.", value_creation="Projected $5,400 /mo in direct lead broker fees.", ctb="Deploy $300/Lead Enterprise Agency Broker Pipeline")
    ]
    db.add_all(mon_recs)

    mon_radars = [
        models.DBMonetizationRadar(id="mrad_1", site_id="site_fintech", program="Titan Wealth VIP Partner Program", update="New 40% RevShare Tier added for qualified wealth publishers.", match_score="99%"),
        models.DBMonetizationRadar(id="mrad_2", site_id="site_fintech", program="Yieldstreet Private Credit Affiliates", update="CPA bumped from $100 to $250 for verified initial deposits > $5,000.", match_score="95%"),
        models.DBMonetizationRadar(id="mrad_3", site_id="site_fintech", program="Interactive Brokers Prime Referrals", update="Launched custom iframe enrollment widgets with zero tracking cookie loss.", match_score="91%")
    ]
    db.add_all(mon_radars)

    # Seed Competitors & Trends
    comps = [
        models.DBCompetitor(id="comp_1", site_id="site_fintech", name="Bankrate Wealth", publishing_velocity="18 Articles / Wk", threat_level="Moderate", topic_overlap="42%", open_gap="Highly superficial descriptions of Algorithmic Tax harvesting. Weak mobile ROI calculators."),
        models.DBCompetitor(id="comp_2", site_id="site_fintech", name="Financial Samurai", publishing_velocity="3 Articles / Wk", threat_level="High Alignment", topic_overlap="78%", open_gap="Heavy text, minimal GEO AI structured lists. Easy to beat in ChatGPT/Perplexity citations."),
        models.DBCompetitor(id="comp_bh", site_id="site_biohack", name="Examine.com", publishing_velocity="25 Articles / Wk", threat_level="High Authority", topic_overlap="65%", open_gap="Strictly academic. Does not provide direct affiliate supplement brand comparisons or actionable morning protocols."),
        models.DBCompetitor(id="comp_ss", site_id="site_saas", name="Zapier Blog", publishing_velocity="35 Articles / Wk", threat_level="Massive Volume", topic_overlap="82%", open_gap="Very generic no-code focus. Complete blindspot for developer-first open source Python swarms.")
    ]
    db.add_all(comps)

    int_trends = [
        models.DBInterceptedTrend(id="it_1", site_id="site_fintech", topic="Stripe Treasury Accounts vs Mercury for AI Startups", source="X (Twitter) & HackerNews Trending", urgency="Golden Window (Act within 48 Hrs)", search_demand_spike="+640% in last 3 days", fast_response_brief="Title: Stripe Treasury vs Mercury: Best Banking for AI Startups (2026). Structure: Quick comparison table, deposit safety (FDIC limits), API ease of integration, multi-currency yield. CTB link to Mercury institutional partner program.", ctb="Deploy Fast Response Brief to Secure Trend Dominance"),
        models.DBInterceptedTrend(id="it_2", site_id="site_fintech", topic="How does the new 2026 Unrealized Gains Tax Proposal affect Roth IRA conversions?", source="Reddit r/fatFIRE & r/investing", urgency="High Intent Window", search_demand_spike="+410%", fast_response_brief="Title: 2026 Unrealized Gains Tax: Will Your Roth IRA Conversions Be Taxed? Comprehensive breakdown of the draft congressional bill, safe harbor strategies, and CPA insights. Embedded high net worth newsletter signup.", ctb="Deploy Fast Response Brief to Secure Trend Dominance"),
        models.DBInterceptedTrend(id="it_ss", site_id="site_saas", topic="Self-correcting web scrapers using GPT-4o Vision API", source="GitHub Trending & Dev.to", urgency="Immediate Action", search_demand_spike="+890%", fast_response_brief="Title: Building Self-Correcting Web Scrapers with GPT-4o Vision & LangChain. Step-by-step code tutorial with embedded API keys and GitHub repo links.", ctb="Deploy Fast Response Brief to Secure Trend Dominance")
    ]
    db.add_all(int_trends)

    # Seed Hive
    hives = [
        models.DBHiveLearning(id="hive_1", origin_site="FinTech Compounder", target_site="Longevity & Biohacking Lab", learning_summary="Interactive JavaScript 'Calculate Your Real ROI' sidebar widgets increased affiliate link conversion CTR by 41.6% and boosted average Time-on-Site by 2 minutes and 14 seconds.", adaptation_plan="Deploy a custom 'Calculate Your Monthly Supplement Cost Alpha' interactive slider on our Biohacking review pages to achieve the identical conversion multiplier.", projected_lift="+35% Affiliate Revenue Lift", ctb="Transfer Winning Interactive Widget Strategy"),
        models.DBHiveLearning(id="hive_2", origin_site="AI Workflows & SaaS B2B", target_site="FinTech Compounder", learning_summary="Restructuring AI review articles to start with a raw 'Why I Built This Audit' 60-second audio voiceover embedded note built immense EEAT trust and dropped bounce rate to 18%.", adaptation_plan="Inject 60-second expert voiceover summaries recorded by Alexander Vance at the top of our 10 primary FinTech credit card & banking review pillars.", projected_lift="+24% Organic Rank Retention", ctb="Transfer Winning Audio Voiceover Strategy")
    ]
    db.add_all(hives)

    # Seed Morning Briefings
    mbs = [
        models.DBMorningBriefing(
            site_id="site_fintech",
            date="Wednesday, June 17, 2026",
            situation_summary="FinTech Compounder compounded beautifully overnight, driving 1,420 unique high-net-worth sessions and locking in $540 in passive wealth affiliate commissions. Google June Core update has settled, rewarding our interactive tax calculators with 4 new #1 pillar rankings. All Tier 1 routine maintenance (14 broken links, 28 dynamic tax tables) was executed flawlessly while you slept.",
            strategic_focus=[
                {"id": "sf_1", "decision": "Deploy the new 'AI Direct Indexing' 8-article investment cluster to intercept Bankrate before their topical gap closes.", "tier": "Tier 3 Decision", "return_est": "+$2,800/mo Est."},
                {"id": "sf_2", "decision": "Approve custom interactive WealthTech Advisory JavaScript widgets to solidify institutional #1 ranking moats.", "tier": "Tier 4 Strategic Decision", "return_est": "Immense Moat"}
            ],
            thirty_day_forecast="Traffic predicted to climb 18.5% heading into the Q3 July tax payment surges. We have queued 3 preemptive content decay refresh shields for early July execution.",
            rev_compounded_month="$8,140",
            rev_pacing_target="$14,250 (+18.4% YoY)",
            rev_rpm_alpha="$338.50 per 1,000 unique sessions",
            rev_top_driver="Top 5 High-Yield Cash Vaults ($2,100 this week)"
        ),
        models.DBMorningBriefing(
            site_id="site_biohack",
            date="Wednesday, June 17, 2026",
            situation_summary="Longevity Lab experienced a phenomenal 24% organic spike from Perplexity Pro citations on our NAD+ Precursor breakdowns. Total overnight recurring revenue reached $380. Autonomous routines repaired 6 PubMed DOI link endpoints and synchronized 19 out-of-stock affiliate items with zero traffic leakage.",
            strategic_focus=[
                {"id": "sf_bh_1", "decision": "Secure the private HigherDOSE 15% Brand Partnership to replace low-yield 3% Amazon commissions.", "tier": "Monetization Upgrade", "return_est": "+$2,100/mo Added Lift"},
                {"id": "sf_bh_2", "decision": "Invest in the 6-article 'Urolithin A Muscle Mitophagy' content opportunity portfolio.", "tier": "Tier 3 Decision", "return_est": "+$4,100/mo Lift"}
            ],
            thirty_day_forecast="Strong Perplexity and Claude discovery pipeline expected to surpass Google Search organic discovery by July 15. GEO Answer Bait strategies queued.",
            rev_compounded_month="$5,620",
            rev_pacing_target="$9,820 (+24.1% YoY)",
            rev_rpm_alpha="$316.00 per 1,000 unique sessions",
            rev_top_driver="Urolithin A Clinical Teardown"
        ),
        models.DBMorningBriefing(
            site_id="site_saas",
            date="Wednesday, June 17, 2026",
            situation_summary="AI B2B Workflows logged its highest monetization day of the quarter, closing two annual B2B software referral contracts worth $1,850. Overall organic visibility is incredibly strong, with our LangGraph vs CrewAI deep dive holding #1 on both GitHub trend lists and ChatGPT Search. Tier 1 meta pricing descriptors were updated autonomously.",
            strategic_focus=[
                {"id": "sf_ss_1", "decision": "Deploy the $300/Lead Enterprise CTO Implementation lead capture form to monetize high-intent developer visits.", "tier": "Monetization Upgrade", "return_est": "+$5,400/mo Lift"},
                {"id": "sf_ss_2", "decision": "Approve the 'Local LLM Privacy RAG' 10-article investment portfolio to capture urgent enterprise demand.", "tier": "Tier 3 Decision", "return_est": "+$8,500/mo Lift"}
            ],
            thirty_day_forecast="Enterprise budget planning cycles kick off next month. Preparing automated LinkedIn B2B carousel atomization suites to maximize executive awareness.",
            rev_compounded_month="$12,840",
            rev_pacing_target="$21,400 (+31.6% YoY)",
            rev_rpm_alpha="$718.00 per 1,000 unique sessions",
            rev_top_driver="Evaluating Open Source Multi-Agent Frameworks"
        )
    ]
    db.add_all(mbs)

    # Seed Chat Message Greeting
    msg = models.DBChatMessage(
        id=str(uuid.uuid4()),
        site_id="site_fintech",
        sender="ai",
        text="Greetings Shareholder. I am your fully autonomous Co-Director. I have active memory access to all 3 website assets, Layer 2 Niche trend signals, and verified Stripe/Impact affiliate conversion webhooks. What strategic asset directive or compounding campaign shall we orchestrate today?",
        timestamp="06:00 AM"
    )
    db.add(msg)

    db.commit()
    db.close()
    print("Flawless database seed complete!")

if __name__ == "__main__":
    init_database()
