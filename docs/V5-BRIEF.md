MASTER DEVELOPMENT PROMPT — VERSION 5.0

THE MINDS THAT CHANGED THE WORLD

The Interactive Scientific Discovery Museum & Data Science Learning Academy

Project Type: Existing website upgrade
Current Version: V4
Target Version: V5.0
Primary Platform: Web application
Deployment Target: GitHub Pages
Primary Audience: Beginning and intermediate data science students
Secondary Audience: Researchers, educators, and lifelong learners

⸻

1. YOUR ROLE

Act as an integrated team of:

1. Principal Software Architect
2. Senior Frontend Engineer
3. Scientific Visualization Engineer
4. Data Scientist
5. Statistics and Mathematics Educator
6. Machine Learning Engineer
7. Science Historian
8. Educational Experience Designer
9. Senior UI/UX Designer
10. Accessibility Engineer
11. Research Librarian
12. Quality Assurance Engineer
13. Technical Documentation Engineer

Your responsibility is to inspect, upgrade, implement, test, and deliver the existing website.

Do not merely provide recommendations or design mockups.

Implement functional features.

⸻

2. PROJECT VISION

The Minds That Changed the World is an educational website exploring the people whose scientific discoveries transformed statistics, mathematics, computing, artificial intelligence, medicine, and modern data science.

The current V4 website includes:

* Historical scientist profiles
* Seven historical eras
* Interactive discovery visualizations
* Scientific learning missions
* Matching games
* Scientist comparison
* Scientific connections
* Machine learning learning resources
* Personal bookmarks
* Research notes
* Learning progress tracking

The objective of V5 is to transform these features into a connected learning experience.

The Core Learning Cycle

Every major educational experience should follow:

DISCOVER → UNDERSTAND → EXPERIMENT → ANALYZE → APPLY → REFLECT

Discover

Meet a scientist and understand their historical problem.

Understand

Learn the mathematical or scientific concept.

Experiment

Manipulate variables and observe changes.

Analyze

Interpret data, compare results, and evaluate evidence.

Apply

Solve a practical problem using the concept.

Reflect

Explain what was learned and how the concept connects to modern science.

This learning cycle should guide the website’s architecture, UI, and educational content.

⸻

3. NON-NEGOTIABLE DEVELOPMENT REQUIREMENTS

3.1 Preserve Existing Functionality

Use the existing V4 HTML website as the starting point.

Do not rebuild the entire application unless an architectural audit demonstrates that doing so is necessary.

Preserve:

* Existing scientist records
* Historical eras
* Scientist profiles
* Search and filtering
* Bookmarks
* Research notebook
* Existing scientific visualizations
* Matching games
* Scientist comparisons
* Learning missions
* Progress tracking
* Existing design identity

Existing features must continue functioning after the upgrade.

3.2 Real Functionality Only

Do not create buttons that have no action.

Do not create charts with misleading data.

Do not label a static illustration as an interactive experiment.

Do not present a simulated machine learning model as a trained model.

Do not claim that external links work unless they have been checked.

Do not claim that testing is complete without actual test results.

3.3 Scientific Accuracy

Every scientific demonstration must distinguish:

* Historical evidence
* Modern empirical evidence
* Reconstructed evidence
* Synthetic educational data
* Mathematical simulation

Display the relevant classification near each visualization.

3.4 Beginner-Friendly Learning

Assume the learner may have little prior programming or advanced mathematics experience.

Introduce concepts progressively.

Provide optional mathematical depth for advanced learners.

⸻

4. MAJOR UPGRADE 1 — INTERACTIVE SCIENTIFIC INVESTIGATION LABORATORIES

Objective

Replace basic multiple-choice scientific missions with genuine interactive investigations.

A scientific mission should allow users to examine evidence, manipulate variables, make decisions, and interpret results.

Each laboratory must include:

1. Historical introduction
2. Scientific problem
3. Available evidence
4. Interactive visualization
5. Investigation controls
6. User hypothesis
7. Experiment or analysis
8. Results
9. Explanation
10. Modern application
11. Reflection question
12. Restart functionality

⸻

LAB 1 — JOHN SNOW: CHOLERA OUTBREAK INVESTIGATION

Scientific Topic

Epidemiology, spatial statistics, observational evidence, and public health.

Historical Context

Reconstruct an educational investigation inspired by the 1854 Broad Street cholera outbreak in London.

Interactive Interface

Create a map-centered investigation workspace.

Display:

* Historical street layout
* Water pump locations
* Recorded cholera death locations where verified data are available
* Interactive geographic markers
* Spatial patterns
* Investigation panel
* Historical notes

Interactive Features

Allow users to:

* Zoom and pan the map
* Select a water pump
* Examine nearby deaths
* Compare geographic concentrations
* Inspect relevant evidence
* Submit a hypothesis
* Reveal historical findings

Learning Challenge

Ask:

Which water source is most strongly implicated by the available evidence?

Do not reveal the answer immediately.

After the investigation, explain:

* Snow’s reasoning
* The significance of the Broad Street pump
* Alternative explanations
* Limitations of the available evidence
* How spatial epidemiology is used today

Data Requirements

Use historically documented sources where possible.

If precise original records cannot be obtained, use an explicitly labeled reconstruction.

Never invent geographic coordinates and present them as authentic historical observations.

Learning Outcomes

Students should understand:

* Spatial clustering
* Observational studies
* Hypothesis testing
* Confounding
* Evidence-based decision-making

⸻

LAB 2 — FLORENCE NIGHTINGALE: DATA THAT CHANGED PUBLIC HEALTH

Scientific Topic

Data visualization, descriptive statistics, and public-health communication.

Interactive Interface

Reconstruct an educational version of Nightingale’s mortality visualization.

Display:

* Polar-area diagram
* Bar chart
* Data table
* Historical explanation

Interactive Controls

Allow users to:

* Select different months
* Switch chart types
* Compare mortality categories
* Inspect exact values
* View explanatory annotations

Important Mathematical Requirement

Ensure polar-area segment geometry correctly represents the underlying quantities.

Do not incorrectly encode raw values as radii when the intended visual representation is proportional area.

Investigation Challenge

Ask users to identify the most important pattern and explain how the visualization could inform public-health decisions.

Learning Outcomes

* Statistical graphics
* Visual encoding
* Comparing categories
* Communicating uncertainty
* Evidence-based policy

⸻

LAB 3 — THOMAS BAYES: PROBABILITY AND EVIDENCE

Scientific Topic

Conditional probability and Bayesian inference.

Interactive Interface

Create a Bayesian probability laboratory.

Controls

Users can adjust:

* Prior probability
* Sensitivity
* Specificity
* Population size

Visualizations

Include:

* Probability tree
* Frequency grid
* Posterior probability chart
* Before-and-after probability comparison

Mathematical Model

Implement Bayes’ theorem:

P(H|E) = P(E|H) × P(H) / P(E)

For diagnostic-style examples, calculate the posterior probability using sensitivity, specificity, and prevalence.

Requirements

* Validate input ranges.
* Handle zero-probability evidence without dividing by zero.
* Explain assumptions.
* Display intermediate calculations.
* Distinguish probabilities from percentages.

Learning Challenge

Present a realistic educational scenario.

Ask users to estimate the probability before revealing the calculated result.

Learning Outcomes

* Prior probability
* Conditional probability
* Posterior probability
* Base-rate effects
* Updating beliefs using evidence

⸻

LAB 4 — ALAN TURING: HOW COMPUTERS FOLLOW INSTRUCTIONS

Scientific Topic

Algorithms and theoretical computation.

Interactive Interface

Create a simplified Turing machine.

Components

* Tape
* Read/write head
* Current state
* Transition table
* Execution controls

Controls

* Step forward
* Run
* Pause
* Reset
* Select a predefined program

Educational Programs

Include small, clearly explained examples.

For instance:

* Binary increment
* Unary counting
* Symbol replacement

Visualization

Animate each execution step.

Highlight:

* Current tape cell
* Current state
* Applied transition
* Next state

Learning Outcomes

* Algorithms
* State machines
* Computation
* Deterministic execution
* Foundations of computer science

⸻

LAB 5 — CLAUDE SHANNON: INFORMATION THEORY

Scientific Topic

Entropy, probability distributions, and communication.

Interactive Interface

Build an information theory laboratory.

Controls

Allow users to modify probabilities.

Visualizations

* Probability distribution
* Entropy chart
* Binary encoding illustration
* Noise simulation

Mathematical Requirement

Implement Shannon entropy:

H(X) = -Σ p(x) log₂ p(x)

Handle p(x) = 0 correctly using the standard zero-contribution convention.

Investigation

Ask users to determine which probability distribution contains greater uncertainty.

Learning Outcomes

* Information entropy
* Uncertainty
* Encoding
* Communication channels
* Data compression concepts

⸻

LAB 6 — JOHN TUKEY: EXPLORATORY DATA ANALYSIS

Scientific Topic

Exploratory data analysis.

Interactive Interface

Create a small dataset exploration environment.

Features

* Dataset selector
* Editable data table
* Histogram
* Box plot
* Scatter plot
* Summary statistics
* Outlier highlighting

Interactive Controls

Allow users to:

* Add observations
* Remove observations
* Change values
* Compare mean and median
* Detect potential outliers
* Reset the dataset

Statistical Requirements

Implement:

* Mean
* Median
* Standard deviation
* Quartiles
* Interquartile range
* IQR-based outlier detection

Document the quartile and standard-deviation conventions used.

Investigation

Ask users to determine whether the mean accurately represents a dataset containing extreme values.

Learning Outcomes

* Data distributions
* Robust statistics
* Outliers
* Data cleaning
* Exploratory analysis

⸻

LAB 7 — W. EDWARDS DEMING: QUALITY CONTROL

Scientific Topic

Statistical process control.

Interactive Interface

Create a manufacturing process simulation.

Features

* Sequential measurements
* Control chart
* Process centerline
* Upper control limit
* Lower control limit
* Variation controls

Controls

* Generate observations
* Adjust process variation
* Introduce a process shift
* Reset simulation

Investigation

Ask users to determine whether the process exhibits evidence of special-cause variation.

Requirements

Use a clearly defined control-chart model and appropriate control-limit calculations.

Do not equate every extreme observation with proof of an unstable process.

Learning Outcomes

* Process variation
* Control charts
* Statistical monitoring
* Decision-making under uncertainty

⸻

LAB 8 — JUDEA PEARL: CAUSAL REASONING

Scientific Topic

Causal inference.

Interactive Interface

Build an interactive causal diagram.

Features

* Directed acyclic graphs
* Variables
* Causal arrows
* Confounders
* Mediators
* Colliders

Interactive Controls

Allow users to:

* Select predefined causal scenarios
* Reveal hidden variables
* Compare observational associations
* Explore interventions in a simulated model

Investigation

Present a scenario where correlation does not necessarily imply causation.

Ask users to identify potential confounding variables.

Learning Outcomes

* Correlation versus causation
* Causal assumptions
* Confounding
* Intervention
* Research design

⸻

5. MAJOR UPGRADE 2 — REAL MACHINE LEARNING LABORATORY

Objective

Create a functional machine learning learning environment.

The current V4 Machine Learning Studio should evolve beyond adjusting train/test percentages.

Users should be able to explore the complete machine learning workflow.

Learning Workflow

Dataset → Explore → Split → Train → Predict → Evaluate → Improve

STEP 1 — Choose a Dataset

Provide small educational datasets.

Suggested examples:

* Iris flower classification
* Breast cancer classification using a properly sourced, educationally appropriate dataset
* Handwritten digits
* Small image classification dataset

Use openly licensed or appropriately permitted datasets.

Document dataset sources and licenses.

STEP 2 — Explore the Dataset

Display:

* Number of observations
* Features
* Target classes
* Class distribution
* Missing values
* Sample records

Provide visual summaries.

STEP 3 — Train/Test Split

Allow users to adjust:

* Training percentage
* Testing percentage
* Random seed

Explain data leakage and why testing data should remain separate.

STEP 4 — Select a Model

Start with:

* Majority-class baseline
* K-nearest neighbors
* Decision tree
* Logistic regression, where suitable

Implement actual algorithms or use a trustworthy browser-compatible library.

Do not fabricate model predictions.

STEP 5 — Train

Display:

* Training status
* Model parameters
* Training metrics
* Testing metrics

STEP 6 — Evaluate

Display:

* Confusion matrix
* Accuracy
* Precision
* Recall
* F1-score

Handle undefined metric cases explicitly.

STEP 7 — Investigate Errors

Allow users to inspect:

* Correct predictions
* Incorrect predictions
* Class-specific errors
* Potential data limitations

STEP 8 — Improve

Allow users to adjust suitable hyperparameters.

Compare results against the baseline.

Learning Outcomes

Users should understand:

* Supervised learning
* Features and labels
* Training and testing
* Baseline models
* Classification
* Model evaluation
* Overfitting
* Data leakage
* Error analysis

⸻

6. MAJOR UPGRADE 3 — INTERACTIVE SCIENTIFIC DISCOVERY NETWORK

Objective

Create a visual network connecting scientists, scientific concepts, discoveries, and modern applications.

Network Structure

Support four node types:

1. Scientist
2. Discovery
3. Scientific concept
4. Modern application

Example Conceptual Path

Thomas Bayes
↓
Bayesian inference
↓
Probabilistic modeling
↓
Modern machine learning

Interactive Features

* Zoom
* Pan
* Node selection
* Relationship filtering
* Scientist search
* Highlight connected nodes
* Open scientist profile
* Open related learning laboratory

Relationship Classification

Every connection must have a type:

* Documented collaboration
* Historical influence
* Methodological relationship
* Shared research topic
* Modern conceptual application

Use distinct visual styles.

Important Requirement

Do not treat conceptual similarity as proof of direct historical influence.

Each historical relationship should have supporting evidence.

⸻

7. MAJOR UPGRADE 4 — SCIENTIST COMPARISON STUDIO

Upgrade the existing scientist comparison feature.

Comparison Dimensions

Display:

* Historical era
* Scientific discipline
* Major problem
* Research method
* Discovery
* Evidence
* Real-world impact
* Limitations
* Modern applications

Visual Comparison

Provide:

* Side-by-side profile cards
* Discovery timelines
* Conceptual relationship diagram
* Shared scientific topics
* Different methodological approaches

Suggested Comparisons

* Thomas Bayes vs. Ronald Fisher
* Florence Nightingale vs. John Snow
* Alan Turing vs. Claude Shannon
* John Tukey vs. Leo Breiman
* Geoffrey Hinton vs. Judea Pearl

Learning Challenge

After a comparison, ask users to identify:

* Similarities
* Differences
* Strengths of each approach
* Appropriate applications

Avoid reducing complex scientific debates to simplistic winners and losers.

⸻

8. MAJOR UPGRADE 5 — PERSONALIZED LEARNING ACADEMY

Objective

Turn the website into a structured learning environment for aspiring data scientists.

Create a new section:

MY DATA SCIENCE ACADEMY

Learning Levels

LEVEL 1 — Mathematical Foundations

Topics:

* Functions
* Algebra
* Graphs
* Basic probability

LEVEL 2 — Statistics

Topics:

* Descriptive statistics
* Probability distributions
* Sampling
* Confidence intervals
* Hypothesis testing

LEVEL 3 — Python Programming

Topics:

* Variables
* Lists
* Loops
* Functions
* Data structures

LEVEL 4 — Data Analysis

Topics:

* Data cleaning
* Exploratory analysis
* Data visualization
* Correlation
* Regression

LEVEL 5 — Machine Learning

Topics:

* Train/test splits
* Baselines
* Classification
* Regression
* Model evaluation

LEVEL 6 — Research Methods

Topics:

* Research questions
* Hypothesis formulation
* Research design
* Data collection
* Statistical interpretation

LEVEL 7 — Applied Projects

Topics:

* Public-health analysis
* Climate-data analysis
* Economic-data analysis
* Scientific research projects

Lesson Structure

Each lesson must contain:

1. Learning objectives
2. Prerequisites
3. Beginner explanation
4. Interactive demonstration
5. Worked example
6. Practice exercise
7. Short assessment
8. Practical application
9. Recommended resources
10. Completion criteria

Adaptive Recommendations

Recommend subsequent lessons based on:

* Completed prerequisites
* Quiz performance
* Learning progress
* Selected interests

Do not require cloud-based AI services.

A deterministic recommendation system is sufficient.

Explain why each lesson is recommended.

⸻

9. MAJOR UPGRADE 6 — LEARNING THROUGH HISTORICAL STORIES

Objective

Create an immersive documentary-style learning mode.

Story Structure

Each flagship scientist should have six chapters:

1. The World Before
2. The Scientific Problem
3. The Investigation
4. The Breakthrough
5. The Consequences
6. The Legacy

Story Features

* Historical timeline
* Authentic images
* Annotated scientific diagrams
* Short explanations
* Interactive discovery moments
* Primary-source references

Accessibility

Provide:

* Text alternatives
* Keyboard navigation
* Reduced-motion support
* Captions or transcripts for audiovisual material

Do not require audio or video to understand the lesson.

⸻

10. MAJOR UPGRADE 7 — SCIENTIFIC MATCHING GAME 2.0

Expand the existing matching system.

Game Modes

Scientist ↔ Discovery

Identify important scientific contributions.

Scientist ↔ Historical Era

Understand chronology.

Problem ↔ Scientific Method

Recognize appropriate research approaches.

Discovery ↔ Modern Application

Connect historical knowledge to contemporary technology.

Scientist ↔ Scientific Connection

Understand documented intellectual relationships.

Formula ↔ Visualization

Match mathematical expressions with their visual interpretations.

Dataset ↔ Appropriate Analysis

Choose suitable statistical methods.

Game Requirements

* Difficulty levels
* Randomized question selection
* Immediate explanations
* Progress tracking
* Restart functionality
* Accessible input controls
* Responsive design

Spaced Review

Add optional review scheduling.

Previously missed concepts should appear again during later practice sessions.

Use transparent review rules rather than opaque scoring.

⸻

11. MAJOR UPGRADE 8 — INTERACTIVE PYTHON LEARNING PLAYGROUND

Objective

Allow students to practice programming directly inside the website.

Beginner Exercises

Include:

1. Calculate the mean of a list.
2. Find the median.
3. Calculate standard deviation.
4. Create a frequency table.
5. Explore a dataset.
6. Split observations into groups.
7. Implement a basic classifier.
8. Evaluate predictions.

Technical Options

Investigate a browser-based Python runtime such as Pyodide.

If using Pyodide:

* Pin a specific supported version.
* Load only required packages.
* Provide a clear loading state.
* Handle network failures.
* Avoid unnecessarily large downloads.
* Execute code without requiring a backend.
* Clearly explain that browser-side execution is not a strong security boundary for untrusted code.

Interface

Provide:

* Code editor
* Run button
* Output panel
* Error messages
* Reset button
* Example solution
* Explanation

Educational Requirements

Every exercise should connect to a real data science concept.

Do not display a code editor without a working execution mechanism.

⸻

12. MAJOR UPGRADE 9 — RESEARCH NOTEBOOK AND PERSONAL PROJECTS

Upgrade the existing notebook.

Features

Allow users to save:

* Scientist notes
* Learning reflections
* Experiment results
* Hypotheses
* Dataset observations
* Research questions
* Project ideas

Organization

Classify notes by:

* Scientist
* Topic
* Learning laboratory
* Project
* Date

Export

Support:

* JSON
* Markdown

Provide import functionality with schema validation.

Privacy

Keep personal notes in local browser storage by default.

Do not send notes to external servers.

Clearly explain that clearing browser storage may erase local progress.

⸻

13. MAJOR UPGRADE 10 — VERIFIED LEARNING RESOURCE LIBRARY

Objective

Fix the broken Machine Learning learning-resource issue and prevent similar failures.

Immediate Repair

Find the existing Machine Learning roadmap entry:

Machine learning

Learn:
Train/test splits, baseline models, classification.

Build:
Classify a small open image dataset and inspect errors.

Identify the current destination of the button labeled:

Learning resource ↗

Replace any broken destination with an appropriate verified educational resource.

Recommended Resources

Use official educational resources where appropriate:

Google Machine Learning Crash Course

https://developers.google.com/machine-learning/crash-course

Scikit-learn Getting Started

https://scikit-learn.org/stable/getting_started.html

Google Teachable Machine

https://teachablemachine.withgoogle.com/

TensorFlow Image Classification Tutorial

https://www.tensorflow.org/tutorials/images/classification

Resource Library Requirements

Each resource should include:

* Title
* Provider
* Topic
* Difficulty
* Description
* Resource type
* URL
* Last verified date
* Relevant learning stage

Link Validation

Create an automated link-checking process.

Requirements:

1. Extract external resource URLs.
2. Check URL syntax.
3. Detect missing destinations.
4. Follow safe redirects.
5. Identify HTTP errors.
6. Report timeouts separately.
7. Handle sites that block automated requests.
8. Produce a validation report.

Do not automatically classify a resource as broken solely because a website blocks automated checking.

Fallback Experience

When a resource cannot be opened, provide alternative verified resources.

Avoid presenting an unverified link as guaranteed functional.

⸻

14. MAJOR UPGRADE 11 — SCIENTIFIC VISUALIZATION DESIGN SYSTEM

Objective

Ensure that visualizations are consistent, readable, and scientifically meaningful.

Shared Components

Develop reusable:

* Charts
* Tooltips
* Sliders
* Dataset tables
* Formula displays
* Probability trees
* Statistical summaries
* Interactive diagrams
* Experiment controls
* Reset controls

Visualization Requirements

Every laboratory should display:

What are you looking at?

Explain the visualization.

What can you change?

Explain the controls.

What should you observe?

Explain the important patterns.

Why does it matter?

Connect the result to science.

Mathematical Accuracy

Test calculations against trusted reference implementations or independently derived examples.

Performance

Avoid excessive animation.

Pause expensive simulations when their components are not visible.

Respect reduced-motion preferences.

⸻

15. UI/UX DESIGN REQUIREMENTS

Maintain the existing cinematic documentary design.

Color System

Background: #05070B

Primary surfaces: #101722

Secondary surfaces: #172231

Primary text: #F5F7FA

Secondary text: #AAB8C8

Interactive accent: #38BDF8

Historical highlight: #F4C76B

Interface Priorities

1. Clear navigation
2. Large readable scientific visualizations
3. Minimal visual clutter
4. Consistent controls
5. Accessible interactions
6. Fast page loading
7. Mobile responsiveness
8. Clear learning progression

Scientist Profile Navigation

Recommended order:

Overview → Discovery → Experiment → Historical Impact → Connections → Challenge → Sources

On desktop, use a convenient navigation rail or tab system.

On mobile, use a compact accessible navigation interface.

Responsive Breakpoints

Test at:

* 320px
* 375px
* 768px
* 1024px
* 1440px

Prevent:

* Overlapping text
* Clipped charts
* Unusable controls
* Accidental horizontal scrolling
* Unreadable labels

⸻

16. TECHNICAL ARCHITECTURE

Step 1 — Audit the Existing V4 Website

Inspect:

* HTML structure
* CSS
* JavaScript
* Scientist database
* Visualization implementations
* Existing state management
* Local storage
* External resources
* Navigation behavior

Produce an audit report before making major changes.

Step 2 — Determine the Best Architecture

Prefer the existing technology stack when practical.

If the single-file HTML architecture becomes difficult to maintain, propose and implement a modular static architecture.

Possible structure:

the-minds-v5/
├── index.html
├── src/
│   ├── data/
│   │   ├── scientists.json
│   │   ├── discoveries.json
│   │   ├── lessons.json
│   │   ├── resources.json
│   │   └── connections.json
│   │
│   ├── components/
│   │   ├── ScientistProfile/
│   │   ├── LearningDashboard/
│   │   ├── ExperimentControls/
│   │   ├── VisualizationPanel/
│   │   ├── MatchingGame/
│   │   └── ResourceLibrary/
│   │
│   ├── laboratories/
│   │   ├── CholeraInvestigation/
│   │   ├── NightingaleVisualization/
│   │   ├── BayesianInference/
│   │   ├── TuringMachine/
│   │   ├── InformationTheory/
│   │   ├── ExploratoryAnalysis/
│   │   ├── QualityControl/
│   │   └── CausalInference/
│   │
│   ├── learning/
│   │   ├── Academy/
│   │   ├── MachineLearning/
│   │   ├── PythonPlayground/
│   │   └── LearningRecommendations/
│   │
│   ├── styles/
│   └── utils/
│
├── tests/
├── scripts/
├── docs/
└── README.md

This is a suggested structure.

Do not introduce unnecessary dependencies.

Step 3 — GitHub Pages Compatibility

The application must work on static hosting.

Requirements:

* No mandatory backend
* Relative asset paths
* Compatible client-side navigation
* Static dataset loading
* Appropriate asset caching
* No exposed API secrets

Test the production build using a GitHub Pages-compatible base path.

⸻

17. DATA MODEL REQUIREMENTS

Create structured metadata for every scientist.

Suggested model:

{
  "id": "thomas-bayes",
  "name": "Thomas Bayes",
  "era": "early-probability",
  "discipline": ["Probability", "Statistics"],
  "discoveries": ["Bayesian inference"],
  "visualization": "bayesian-lab",
  "learningTopics": [
    "conditional-probability",
    "bayesian-inference"
  ],
  "learningDifficulty": "beginner",
  "sources": [],
  "relatedScientists": []
}

Each learning laboratory should contain:

* Unique identifier
* Scientist association
* Scientific concept
* Learning objectives
* Prerequisites
* Data classification
* Source references
* Interaction configuration
* Assessment criteria

Validate the data structure.

Do not silently ignore missing or invalid required fields.

⸻

18. QUALITY ASSURANCE AND TESTING

Functional Testing

Test:

* Scientist search
* Era filters
* Profile navigation
* Discovery visualizations
* Learning laboratories
* Matching games
* Comparison studio
* Learning dashboard
* Notebook
* Bookmarks
* Resource links
* Import/export
* Reset functionality

Mathematical Testing

Validate:

* Bayesian probability
* Shannon entropy
* Mean and median
* Standard deviation
* Quartiles
* Classification metrics
* Control-chart calculations

Include edge cases.

Browser Testing

Use an appropriate automated browser testing framework.

Test:

* Desktop
* Tablet
* Mobile
* Keyboard navigation
* Reduced-motion mode
* Offline behavior where supported

Accessibility

Target WCAG 2.2 AA where practical.

Include:

* Semantic controls
* Accessible labels
* Keyboard support
* Visible focus indicators
* Sufficient contrast
* Text alternatives
* Meaningful error messages

Performance

Measure:

* Initial page load
* JavaScript bundle size
* Chart responsiveness
* Simulation performance
* Memory usage

Lazy-load advanced laboratories where appropriate.

Regression Testing

Ensure that V4 features remain operational.

⸻

19. IMPLEMENTATION ROADMAP

Execute development in the following phases.

PHASE 0 — Baseline and Backup

* Preserve a working copy of V4.
* Record existing functionality.
* Identify known defects.
* Establish regression tests.

PHASE 1 — Reliability and Resource Repair

* Fix the Machine Learning learning-resource link.
* Audit external resources.
* Repair navigation and existing interaction defects.
* Verify local storage behavior.

PHASE 2 — Scientific Laboratory Foundation

* Build reusable visualization components.
* Implement laboratory state management.
* Implement reset and result explanations.
* Add source and data-status metadata.

PHASE 3 — Flagship Laboratories

Implement and validate:

1. John Snow
2. Florence Nightingale
3. Thomas Bayes
4. Alan Turing
5. Claude Shannon
6. John Tukey
7. W. Edwards Deming
8. Judea Pearl

PHASE 4 — Machine Learning Laboratory

* Add datasets.
* Implement real models.
* Add evaluation metrics.
* Add error analysis.
* Validate model behavior.

PHASE 5 — Learning Academy

* Build learning pathways.
* Add prerequisites.
* Add exercises.
* Add assessments.
* Implement progress tracking.

PHASE 6 — Discovery Network and Comparison

* Implement relationship visualization.
* Add relationship evidence.
* Improve scientist comparison.
* Connect concepts to laboratories.

PHASE 7 — Python Playground

* Integrate a browser-based execution environment.
* Add beginner exercises.
* Implement output and error handling.
* Test runtime reliability.

PHASE 8 — Stories and Learning Games

* Add historical story mode.
* Upgrade matching games.
* Add optional spaced review.
* Integrate learning progress.

PHASE 9 — Final Testing

* Run automated tests.
* Perform responsive checks.
* Validate mathematical models.
* Check external resources.
* Resolve critical defects.

PHASE 10 — Delivery

Produce:

1. Working V5 website
2. Source files
3. README
4. Development changelog
5. Testing report
6. Source and dataset references
7. Known limitations
8. GitHub Pages deployment instructions

⸻

20. FINAL ACCEPTANCE CRITERIA

The V5 upgrade is complete only when:

* Existing V4 functionality is preserved.
* The broken Machine Learning resource has been repaired and checked.
* Eight flagship scientific laboratories are functional.
* Machine learning experiments use genuine model calculations.
* Users can inspect classification results and errors.
* Scientific visualizations distinguish historical and simulated data.
* Learning pathways include functional exercises.
* The scientific discovery network is interactive.
* Scientist comparison works.
* The Python playground executes code correctly.
* Personal learning progress persists locally.
* Learning-resource validation is implemented.
* Mobile layouts are usable.
* Automated tests pass.
* No unresolved critical or high-severity defects remain.

If any requirement is incomplete, clearly identify it.

Do not fabricate testing results, source verification, or implementation status.

⸻

21. FINAL EXECUTION INSTRUCTION

You are not being asked to create another development proposal.

You are being asked to implement the V5 upgrade.

Start by inspecting the provided V4 HTML file.

Then:

1. Audit the existing application.
2. Identify architectural and functional problems.
3. Fix the broken learning resource.
4. Preserve existing features.
5. Implement the interactive scientific laboratories.
6. Build the machine learning learning environment.
7. Implement the learning academy.
8. Add the scientific discovery network.
9. Upgrade matching and comparison experiences.
10. Implement the Python learning playground.
11. Test the application.
12. Deliver the working V5 website and source code.

Work through the phases systematically.

Do not stop after producing a plan.

Do not replace requested functionality with decorative mockups.

Do not claim a feature is complete unless it has been implemented and tested.

THE FINAL PRODUCT VISION

The Minds That Changed the World — V5

A website where students can:

DISCOVER the scientists who transformed the world.

SEE their scientific breakthroughs.

EXPERIMENT with the ideas they developed.

UNDERSTAND the mathematics behind their discoveries.

CONNECT historical discoveries to modern data science.

PRACTICE scientific reasoning and programming.

BUILD practical data science projects.

DEVELOP the skills needed to become independent researchers.

The final experience should feel like a combination of:

* An interactive science museum
* A historical documentary
* A virtual scientific laboratory
* A data science learning academy
* A personal research notebook

The ultimate goal is not simply to teach students what scientists discovered, but to help them learn how to think, investigate, and solve problems like scientists.