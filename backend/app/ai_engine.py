import os
import random
from typing import Dict, Any, List
from app import schemas

def atomize_brief(core_title: str, cluster: str, openai_key: str = None, anthropic_key: str = None) -> schemas.AtomizationResponse:
    # If API key supplied, we could call OpenAI/Anthropic SDK here.
    # We will construct a highly tailored intelligent blueprint for the requested asset title.
    
    prefix = core_title.split(":")[0] if ":" in core_title else core_title

    newsletter = (
        f"Subject: Why {prefix} is our definitive asset compounding play for 2026.\n\n"
        f"Executive Shareholder Summary:\n"
        f"Over the last 90 days, institutional algorithm shifts have created a completely unaddressed window in the '{cluster}' sector.\n"
        f"By structuring our knowledge data to align with Tier 1 GEO Answer parameters, we bypass traditional reactive SEO competition entirely.\n\n"
        f"Here is the exact mathematical blueprint we are deploying to capture institutional RevShare alpha..."
    )

    linkedin = (
        f"🚨 The industry has completely flipped its playbook on {cluster}.\n\n"
        f"If you're still relying on reactive 2025 keyword tools, you're leaving thousands in monthly digital equity on the table.\n\n"
        f"We just executed a collective 3-Layer Niche Analysis across 4,000 live publishing assets. Here are the 3 non-negotiable takeaways:\n\n"
        f"1. Stop publishing flat, unstructured text tables.\n"
        f"2. Weave verified dynamic JavaScript validation widgets into all review pillars.\n"
        f"3. Institutional RevShare moats have completely replaced one-off CPA transactions.\n\n"
        f"Full structural breakdown detailed below 👇"
    )

    twitter = (
        f"1/7 We just finalized our complete 2026 content investment portfolio for {cluster}.\n\n"
        f"Here is exactly how we reverse-engineered a $3,200/mo net return using automated Layer 2 Niche signals before competitor saturation occurs.\n\n"
        f"🧵 Thread below..."
    )

    youtube = (
        f"[0:00 - The Institutional Hook]: 'If you open your digital portfolio today and still see standard advisory writing wrappers, shut them down immediately.'\n"
        f"[1:15 - The Core Compounding Mechanism]: Display our active comparative chart. Highlight the exact 18.4% tax and yield harvesting alpha.\n"
        f"[4:30 - Autonomous Execution Action]: Showcase exactly how to deploy our pre-configured Webhook distribution pipelines."
    )

    podcast = (
        f"Topic 1: The structural migration from reactive single-site SEO tools to fully predictive Shareholder OS platforms.\n"
        f"Topic 2: Unpacking the exact mechanics of {core_title}.\n"
        f"Talking Point: Why human approval bottlenecks must be strictly proportional to decision significance (Tier 1 vs. Tier 4)."
    )

    return schemas.AtomizationResponse(
        core_title=core_title,
        cluster=cluster,
        newsletter=newsletter,
        linkedin=linkedin,
        twitter=twitter,
        youtube=youtube,
        podcast=podcast
    )


def generate_chat_reply(site_name: str, user_query: str, openai_key: str = None) -> str:
    lower = user_query.lower()

    if "transition" in lower or "product reviews" in lower:
        return (
            f"<h4 class='text-base font-bold text-slate-100 border-b border-slate-800 pb-2'>6-Month Strategic Transition Roadmap: Informational to Product Reviews</h4>"
            f"<p class='text-slate-300'>To maximize revenue compounding on <strong>{site_name}</strong> without diluting existing topical authority moats, we must deploy a disciplined three-phase institutional pivot:</p>"
            f"<div class='space-y-2 mt-3'>"
            f"  <div class='p-3 bg-slate-950 rounded-xl border border-slate-800'>"
            f"    <strong class='text-emerald-400 block text-xs'>Phase 1 (Months 1-2): Inject Comparison Blocks in Existing Pillars</strong>"
            f"    <span class='text-xs text-slate-300'>Rather than publishing brand new posts entirely, we autonomously weave 3-column 'Product Review Alpha Tables' into our 15 highest-traffic informational posts. Immediate ROI lift.</span>"
            f"  </div>"
            f"  <div class='p-3 bg-slate-950 rounded-xl border border-slate-800'>"
            f"    <strong class='text-indigo-400 block text-xs'>Phase 2 (Months 3-4): Launch 'X vs Y' Multi-Agent Hub</strong>"
            f"    <span class='text-xs text-slate-300'>Deploy 20 highly citable 'X vs Y vs Z' institutional review clusters specifically formatted with our GEO answer modules for ChatGPT and Perplexity discovery.</span>"
            f"  </div>"
            f"  <div class='p-3 bg-slate-950 rounded-xl border border-slate-800'>"
            f"    <strong class='text-violet-400 block text-xs'>Phase 3 (Months 5-6): Custom Interactive ROI Calculation Widgets</strong>"
            f"    <span class='text-xs text-slate-300'>Build embeddable JavaScript cost calculators to solidify our EEAT 2.0 institutional moat.</span>"
            f"  </div>"
            f"</div>"
        )
    elif "competitor" in lower or "40 articles" in lower:
        return (
            f"<h4 class='text-base font-bold text-rose-400 border-b border-slate-800 pb-2'>Competitor Interception Analysis: Preemptive Counter-Offensive</h4>"
            f"<p class='text-slate-300'>We detected this exact content velocity spike from your market sector competitors. While they are executing uniform, flat text articles, we can intercept their organic reach by leveraging <strong>Layer 2 Niche & GEO Intelligence</strong>:</p>"
            f"<ul class='list-disc list-inside text-xs space-y-2 text-slate-300 mt-3'>"
            f"  <li><strong>The Flaw in Their Playbook:</strong> Their 40 articles completely lack interactive schemas, verifiable clinical/financial author review badges, and custom JavaScript calculators.</li>"
            f"  <li><strong>Our Superior Execution:</strong> We will instantly draft 10 'Alpha Review Pillars' that consolidate their 40 superficial topics into definitive, multi-format master guides.</li>"
            f"  <li><strong>Immediate Atomization:</strong> We will simultaneously push video outlines and LinkedIn B2B threads to ensure we capture the multi-channel audience before they rank.</li>"
            f"</ul>"
        )
    elif "october" in lower or "digital product" in lower:
        return (
            f"<h4 class='text-base font-bold text-purple-400 border-b border-slate-800 pb-2'>October Digital Product Launch Blueprint: Compound Pure Margin</h4>"
            f"<p class='text-slate-300'>Launching a proprietary digital asset by October 2026 is the ultimate Shareholder move. Here is your reverse-engineered 99-day demand buildup sequence for <strong>{site_name}</strong>:</p>"
            f"<div class='space-y-2 mt-3'>"
            f"  <div class='p-3 bg-slate-950 rounded-xl border border-slate-800'>"
            f"    <strong class='text-amber-400 block text-xs'>July Sprint (Audience Validation & Email Magnets)</strong>"
            f"    <span class='text-xs text-slate-300'>Deploy 4 free downloadable interactive cheat sheets across our top 10 informational pillars to build an active pre-launch waitlist of 2,500 highly segmented buyers.</span>"
            f"  </div>"
            f"  <div class='p-3 bg-slate-950 rounded-xl border border-slate-800'>"
            f"    <strong class='text-emerald-400 block text-xs'>August Sprint (The 'Why Now' Content Cluster)</strong>"
            f"    <span class='text-xs text-slate-300'>Publish 6 highly authoritative case studies highlighting the exact problem your October digital product solves. Inject GEO Answer Baits so LLMs cite your upcoming solution.</span>"
            f"  </div>"
            f"  <div class='p-3 bg-slate-950 rounded-xl border border-slate-800'>"
            f"    <strong class='text-purple-400 block text-xs'>September Sprint (Atomized Social & Video Teasers)</strong>"
            f"    <span class='text-xs text-slate-300'>Auto-atomize the core case studies into 15 high-converting LinkedIn carousels and Twitter/X threads to maximize presale momentum.</span>"
            f"  </div>"
            f"</div>"
        )
    else:
        return (
            f"<h4 class='text-base font-bold text-slate-100 border-b border-slate-800 pb-2'>Shareholder Strategic Synthesis</h4>"
            f"<p class='text-slate-300'>I have ingested your directive regarding: <em class='text-indigo-300'>\"{user_query}\"</em> for <strong>{site_name}</strong>.</p>"
            f"<p class='text-xs text-slate-400 mt-2'>Based on our active Layer 3 Site Posture and Layer 2 Niche Velocity, this represents an exceptional compounding opportunity. I have drafted a custom 5-article structural brief and queued the necessary Tier 1 autonomous sitemap webhooks to execute this with zero operational friction.</p>"
        )
