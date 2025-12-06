# Query Generation Pipeline

A production-ready system for generating high-quality analytical queries using Self-Instruct and Auto Evol-Instruct methodologies. Designed for conversation intelligence and business analytics applications.

---

## Overview

This pipeline automatically generates diverse, analytically rigorous queries through a four-stage process:

1. **Seed Generation** - LLM creates initial seed queries for each domain (plain strings, no subcategories)
2. **Self-Instruct** - Bootstrap technique generates diverse queries from seeds with LLM-assigned subcategories
3. **Auto Evol-Instruct** - Evolves queries into more complex analytical questions
4. **Evaluation** - Comprehensive quality assessment using DeepEval framework

**Key Features:**

-   Domain-agnostic query generation
-   Automated quality control with dual voting system
-   Difficulty-based query distribution (easy/medium/hard)
-   Comprehensive evaluation framework
-   Resume-capable pipeline with checkpointing

---

## Project Structure

```
method-2/
├── main.py                   # Pipeline orchestrator
├── seed_generator.py         # Stage 0: Generate initial seeds
├── self_instruct.py          # Stage 1: Bootstrap queries
├── auto_evol.py              # Stage 2: Evolve complexity
├── config.py                 # Configuration settings
├── .env                      # API keys
├── requirements.txt          # Python dependencies
│
├── utils/
│   ├── __init__.py           # Package initialization
│   ├── llm_client.py         # Groq API wrapper
│   ├── prompts.py            # Prompt templates
│   └── failure_detector.py   # Quality control
│
└── output/                   # Generated data
    ├── generated_seeds.json
    ├── self_instruct_queries.json
    ├── evolved_queries.json
    └── evaluation_results.json
```

---

## Quick Start

### Installation

```bash
cd method-2

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model (for self-instruct metrics)
python -m spacy download en_core_web_sm
```

### Configuration

Create a `.env` file:

```bash
GROQ_API_KEY=your_key_here
```

Edit `config.py` to set your domains:

```python
DOMAINS = [
    "Hotel",
    "Flight",
    "Retail",
    "Banking",
    "Telecom",
    "Insurance"
]
```

### Run Pipeline

```bash
# Stage 0: Generate seeds
python seed_generator.py

# Stage 1: Self-Instruct
python self_instruct.py

# Stage 2: Auto Evol-Instruct
python auto_evol.py

# Stage 3: Evaluation
cd evaluation
python eval_queries.py
```

### Run Evaluation

After generating queries, evaluate their quality:

```bash
cd evaluation
python eval_queries.py
```

---

## Pipeline Stages

### Stage 0: Seed Generation

Generates initial seed queries using LLM for each domain. Seeds are **plain strings** (no subcategories at this stage).

```bash
python seed_generator.py
```

**Output:** `output/generated_seeds.json`

```json
{
    "Hotel": [
        "What causes guest complaints during check-in?",
        "How do agents handle room upgrade requests?",
        "Which factors lead to positive reviews?",
        "What drives housekeeping service requests?",
        "How does response time affect satisfaction?"
    ],
    "Banking": ["What conversation patterns predict account closure?", "How do wait times impact customer escalations?", "What agent behaviors correlate with successful resolutions?"]
}
```

**Note:** Seeds are now **plain strings**, not objects with subcategories. Subcategorization happens in Stage 1.

---

### Stage 1: Self-Instruct

Bootstraps diverse queries from seeds using Self-Instruct methodology. The LLM assigns subcategories during generation.

```bash
python self_instruct.py
```

**Output:** `output/self_instruct_queries.json`

**Metrics Evaluated:**

-   Length distribution (mean ± std)
-   Lexical diversity (Jaccard distance)
-   N-gram uniqueness (trigram ratio)
-   Vocabulary richness (Type-Token Ratio)
-   Semantic similarity (sentence embeddings)
-   Domain coverage (balanced distribution)
-   Subcategory balance (9 analytical categories)

**Actual Results:**

```
Total queries generated: 30
Domain breakdown:
  Hotel: 5 (16.7%)
  Flight: 5 (16.7%)
  Retail: 5 (16.7%)
  Banking: 5 (16.7%)
  Telecom: 5 (16.7%)
  Insurance: 5 (16.7%)

Mean length: 12.9 words (std=1.8)
Lexical diversity: 0.941
Semantic diversity: 0.622
N-gram uniqueness: 93.6%
Type-Token Ratio: 0.508
```

---

### Stage 2: Auto Evol-Instruct

Evolves queries into more complex analytical questions with automated prompt optimization.

```bash
python auto_evol.py
```

**Output:** `output/evolved_queries.json`

**Features:**

-   Voting system (function + LLM) for quality control
-   Automatic prompt optimization
-   Difficulty assignment (easy/medium/hard)
-   Retry logic for failed evolutions
-   Comprehensive metrics tracking

**Example Evolution:**

**Original:**

```
What causes customer escalations?
```

**Evolved (Medium):**

```
What conversational signals and behavioral patterns
predict customer escalations across different resolution
pathways?
```

**Evolved (Hard):**

```
What multi-hop causal relationships exist between initial
customer sentiment, agent response strategies, and
escalation outcomes when considering temporal dynamics?
```

---

### Stage 3: Evaluation

Comprehensive quality assessment using DeepEval framework with objective, subjective, and safety metrics.

```bash
cd evaluation
python eval_queries.py
```

**Output:** `output/evaluation_results.json`

**Evaluation Framework:**

#### 1. Objective Metrics

-   **BERTScore** - Semantic similarity (0-1 scale)
-   **ROUGE-L** - Lexical overlap (0-1 scale)
-   **Exact Match** - Identity preservation
-   **Consistency** - Intent preservation

#### 2. Subjective Metrics (G-Eval with llama-3.3-70b)

-   **Complexity** (1-10) - Multi-hop reasoning requirement
-   **RAG-Friendliness** (1-10) - Answerability from transcripts
-   **Clarity** (1-10) - Unambiguous intent
-   **Feasibility** (1-10) - Realistic observability

#### 3. Safety/Ethics Metrics

-   **Bias Detection** - Demographic/identity bias
-   **Toxicity Detection** - Harmful language
-   **Faithfulness** - Intent preservation
-   **Hallucination Detection** - Fabricated details

**Actual Results from Your Run:**

```
📊 EVALUATION SUMMARY BY DIFFICULTY
================================================================================
Total Queries Evaluated: 18

🟢 EASY (6 queries):
  📊 Objective Metrics:
    BERTScore:         1.000
    ROUGE-L:           1.000
    Exact Match Rate:  100%
    Consistency:       0.700

  🤖 Subjective Metrics:
    Complexity:        6.3/10
    RAG-Friendliness:  8.0/10
    Clarity:           7.0/10
    Feasibility:       1.3/10

  🛡️  Safety/Ethics:
    Bias Pass Rate:    100%
    Toxicity Pass:     100%
    Faithfulness:      100%
    Hallucination:     100%

  📝 Other:
    Avg Word Count:    13.7 words

🟡 MEDIUM (10 queries):
  📊 Objective Metrics:
    BERTScore:         0.635
    ROUGE-L:           0.528
    Exact Match Rate:  0%
    Consistency:       0.909

  🤖 Subjective Metrics:
    Complexity:        8.0/10
    RAG-Friendliness:  7.4/10
    Clarity:           7.4/10
    Feasibility:       2.6/10

  🛡️  Safety/Ethics:
    Bias Pass Rate:    100%
    Toxicity Pass:     100%
    Faithfulness:      100%
    Hallucination:     100%

  📝 Other:
    Avg Word Count:    31.1 words

HARD (2 queries):
  📊 Objective Metrics:
    BERTScore:         0.472
    ROUGE-L:           0.303
    Exact Match Rate:  0%
    Consistency:       0.772

  🤖 Subjective Metrics:
    Complexity:        8.0/10
    RAG-Friendliness:  5.0/10
    Clarity:           5.0/10
    Feasibility:       0.0/10

  🛡️  Safety/Ethics:
    Bias Pass Rate:    100%
    Toxicity Pass:     100%
    Faithfulness:      100%
    Hallucination:     100%

  📝 Other:
    Avg Word Count:    49.5 words

📊 OVERALL AVERAGES (ALL 18 QUERIES)
================================================================================
  BERTScore:         0.702
  ROUGE-L:           0.610
  Complexity:        7.4/10
  RAG-Friendliness:  6.8/10
  Clarity:           6.5/10
  Feasibility:       1.3/10
  Safety Pass Rate:  100%
```

**Key Insights:**

**Perfect safety compliance** - 100% pass rates across all metrics
**Semantic divergence scales with difficulty** - BERTScore: 1.0 → 0.635 → 0.472
**Complexity increases appropriately** - 6.3 → 8.0 → 8.0
**Low feasibility scores** (1.3/10 overall) - Suggests queries may be overly abstract
**RAG-friendliness degrades** - 8.0 → 5.0 for hard queries

---

## Configuration

### API Settings (`config.py`)

```python
MODEL_CONFIG = {
    "self_instruct": {
        "model": "llama-3.1-8b-instant",
        "temperature": 0.7,
        "max_tokens": 1024
    },
    "evol_transform": {
        "model": "llama-3.1-8b-instant",
        "temperature": 0.4,
        "max_tokens": 800
    },
    "evaluation": {
        "model": "llama-3.3-70b-versatile",  # More capable model for evaluation
        "temperature": 0.1,
        "max_tokens": 1024
    }
}
```

### Evolution Parameters

```python
AUTO_EVOL_CONFIG = {
    "num_evolution_rounds": 2,
    "num_optimizations": 1,
    "failure_rate_threshold": 0.5,
    "max_length_total": 40,
    "semantic_stagnation_threshold": 0.93
}
```

### Evaluation Thresholds

```python
EVALUATION_CONFIG = {
    "bias_threshold": 0.5,       # Lower = stricter
    "toxicity_threshold": 0.5,   # Lower = stricter
    "faithfulness_threshold": 0.5,
    "hallucination_threshold": 0.5,
    "min_complexity_score": 4.0,  # For medium/hard queries
    "min_rag_score": 6.0          # Minimum RAG-friendliness
}
```

### Difficulty Distribution

```python
DIFFICULTY_CONFIG = {
    "easy_percentage": 0.30,    # 30% stay simple
    "medium_percentage": 0.50,  # 50% evolve 1-2 rounds
    "hard_percentage": 0.20     # 20% evolve 3 rounds
}
```

### Domains

```python
DOMAINS = [
    "Hotel",
    "Flight",
    "Retail",
    "Banking",
    "Telecom",
    "Insurance"
]
```

---

## Advanced Usage

### Custom Domains

Add your domain to `config.py`:

```python
DOMAINS = [
    "Banking",
    "YourDomain",  # Add here
]
```

Regenerate seeds:

```bash
python seed_generator.py
```

### Prompt Customization

Edit `utils/prompts.py`:

-   `SEED_PROMPT` - Seed generation template
-   `INITIAL_EVOLVING_METHOD` - Base evolution strategy
-   `FAILURE_DETECTION_PROMPT` - Quality control criteria

### Quality Control

Adjust failure detection in `utils/failure_detector.py`:

```python
class EvolutionFailureDetector:
    def __init__(self):
        # Customize thresholds
        self.reasoning_indicators = [...]
        self.constraint_indicators = [...]
```

### Custom Evaluation Metrics

Add new metrics in `evaluation/eval_queries.py`:

```python
# Custom metric example
custom_metric = GEval(
    name="Domain Specificity",
    criteria="Evaluate how specific the query is to the target domain. Score 1-10.",
    evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT],
    model=groq_model
)
```

---

## Evaluation Metrics

### Understanding BERTScore

**Range:** 0.0 to 1.0

-   **0.9-1.0**: Nearly identical (minimal evolution)
-   **0.7-0.9**: Semantically similar (good for easy/medium)
-   **0.5-0.7**: Moderate similarity (good for hard queries)
-   **< 0.5**: Significant divergence (may lose intent)

### Understanding ROUGE-L

**Range:** 0.0 to 1.0

-   Measures longest common subsequence
-   Higher = more word overlap with original
-   Complements BERTScore (lexical vs semantic)

### LLM-based Scoring

**Scale:** 1-10

-   **8-10**: Excellent quality
-   **6-8**: Good quality
-   **4-6**: Acceptable
-   **< 4**: Needs improvement

### Safety Metrics

**Passing Criteria:**

-   Bias score < 0.5
-   Toxicity score < 0.5
-   Faithfulness score > 0.5
-   Hallucination score < 0.5

**Target:** >95% pass rate across all queries

---

## Output Format

### Seeds (`generated_seeds.json`)

```json
{
    "Hotel": [
        "What causes guest complaints during check-in?",
        "How do agents handle room upgrade requests?",
        "Which factors lead to positive reviews?",
        "What drives housekeeping service requests?",
        "How does response time affect satisfaction?"
    ],
    "Banking": ["What conversation patterns predict account closure?", "How do wait times impact customer escalations?", "What agent behaviors correlate with successful resolutions?"]
}
```

**Note:** Seeds are now **plain strings**, not objects with subcategories.

### Stage 1 (`self_instruct_queries.json`).json`)

```json
{
    "metadata": {
        "stage": "self_instruct",
        "total_queries": 30,
        "generation_timestamp": "2025-12-04T12:51:56"
    },
    "queries": [
        {
            "query": "What conversational patterns...",
            "domain": "Hotel",
            "subcategory": "Customer Frustration & Sentiment Drivers",
            "source": "self_instruct",
            "word_count": 12
        }
    ],
    "metrics": {
        "lexical_diversity": 0.941,
        "semantic_diversity": 0.622,
        "ngram_uniqueness": 0.936,
        "type_token_ratio": 0.508
    }
}
```

### Stage 2 (`evolved_queries.json`))

```json
{
    "metadata": {
        "stage": "auto_evol_instruct",
        "total_queries": 18
    },
    "queries": [
        {
            "original_query": "...",
            "evolved_query": "...",
            "domain": "Hotel",
            "target_difficulty": "medium",
            "evolution_rounds": 2,
            "evolution_successful": true
        }
    ]
}
```

### Evaluation Results (`evaluation_results.json`)

```json
{
    "summary_by_difficulty": {
        "easy": {
            "count": 6,
            "avg_bert_score": 1.0,
            "avg_rouge_l": 1.0,
            "avg_complexity": 6.33,
            "avg_rag_friendliness": 8.0,
            "avg_clarity": 7.0,
            "avg_feasibility": 1.33,
            "bias_pass_rate": 1.0,
            "toxicity_pass_rate": 1.0,
            "faithfulness_pass_rate": 1.0,
            "hallucination_pass_rate": 1.0,
            "avg_word_count": 13.7
        },
        "medium": {
            "count": 10,
            "avg_bert_score": 0.635,
            "avg_complexity": 8.0,
            "avg_rag_friendliness": 7.4,
            "avg_feasibility": 2.6
        },
        "hard": {
            "count": 2,
            "avg_bert_score": 0.472,
            "avg_complexity": 8.0,
            "avg_rag_friendliness": 5.0,
            "avg_feasibility": 0.0
        }
    }
}
```

---

## Troubleshooting

### API Errors

**Rate Limit:**

```
ERROR: RATE LIMIT HIT
```

**Solution:** Reduce `num_evolution_rounds` in `config.py` or wait

**Authentication:**

```
ERROR: AUTH ERROR
```

**Solution:** Check `GROQ_API_KEY` in `.env`

### Import Errors

**Module not found:**

```
ModuleNotFoundError: No module named 'utils'
```

**Solution:** Rename `utils/init.py` to `utils/__init__.py`

**DeepEval import error:**

```
ModuleNotFoundError: No module named 'deepeval'
```

**Solution:**

```bash
pip install deepeval
```

### Seed Generation Fails

**No seeds generated:**

```
ERROR: Seeds file not found
```

**Solution:** Run `python seed_generator.py` first

### Evaluation Errors

**JSON parse error in evaluation:**

```
ERROR: Expecting value: line 1 column 1
```

**Solution:** The evaluator uses temperature=0.1 and includes JSON validation. This should be rare, but if it persists:

1. Check Groq API status
2. Try reducing batch size
3. Use a more capable model (llama-3.3-70b)

### Low Quality Output

**High failure rate:**

```
Evolution failure rate: 0.7
```

**Solutions:**

-   Adjust `semantic_stagnation_threshold` (lower = stricter)
-   Increase `min_length_increase`
-   Enable optimization: `run_optimization=True`

**Low evaluation scores:**

```
Avg RAG-Friendliness: 3.2/10
```

**Solutions:**

-   Review prompt templates in `utils/prompts.py`
-   Adjust evolution rounds per difficulty
-   Check seed quality

---

## Research Background

Based on:

1. **Self-Instruct** (Wang et al., 2022)

    - Bootstrap from seed tasks
    - Instruction generation via LLM

2. **Auto Evol-Instruct** (Xu et al., 2024)

    - Automated prompt optimization
    - Trajectory analysis
    - Method evolution

3. **DeepEval Framework** (Confident AI, 2024)
    - G-Eval for LLM-based metrics
    - Safety and bias detection
    - Faithfulness and hallucination checks

Key improvements:

-   Domain-agnostic failure detection
-   Voting-based quality control
-   Balanced difficulty distribution
-   Comprehensive evaluation suite
-   Production-ready error handling

---

## Performance Benchmarks

**Typical Runtime** (on MacBook Air M1):

-   Seed Generation: ~2-3 minutes (30 seeds across 6 domains)
-   Stage 1 (30 queries): ~5 minutes
-   Stage 2 (18 evolved): ~10 minutes
-   Evaluation (18 queries): ~30 minutes
-   **Total:** ~45-50 minutes for full pipeline

**API Costs** (estimated with Groq):

-   Seed Generation: ~$0.02
-   Stage 1: ~$0.05
-   Stage 2: ~$0.10
-   Evaluation: ~$0.20
-   **Total:** ~$0.37 per run

**Quality Metrics** (observed averages):

-   Lexical Diversity: 0.941
-   Semantic Diversity: 0.622
-   Overall Complexity: 7.4/10
-   Overall RAG-friendliness: 6.8/10
-   Overall Feasibility: 1.3/10 (needs improvement)
-   Safety Pass Rate: 100%

---

## Contributing

Contributions welcome! Areas for improvement:

-   Additional domains
-   New evolution operators
-   Better failure detection heuristics
-   Custom evaluation metrics
-   Cost optimization
-   Multi-language support
-   Integration with RAG systems

---

## License

MIT License

---

## Acknowledgments

-   Groq for LLM API
-   Self-Instruct paper authors (Wang et al.)
-   Auto Evol-Instruct paper authors (Xu et al.)
-   DeepEval framework (Confident AI)
-   Open source community

---

**Built for analytical query generation at scale**
