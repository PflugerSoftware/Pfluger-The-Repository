# Survey Exploration Kickoff Prompt

Paste the section below as your first message in a new Claude chat, with one of the survey `.json` files attached.

---

## Prompt to paste

I've attached a JSON export from a Pfluger Architects campus master planning survey. The top-level object has these keys: `project_id`, `exported_at`, `survey` (one object), `questions` (array), `responses` (array), `answers` (array), `pins` (array). Load it with `json.load()` and work with it in pandas, or push it into sqlite via `df.to_sql()` if you'd rather join in SQL. Nested fields like `answer_choices`, `answer_matrix`, `answer_ranking`, `boundary_polygon`, `sections`, and `options` are already structured (lists/dicts) - don't `json.loads()` them again.

Questions come in several types: `multiple_choice`, `open_ended`, `matrix_likert`, `ranking`, and `likert_single`. Some are map-based and let respondents drop pins (geolocated points with an optional free-text note); most are not. Treat the structured answers, the open-ended text, and the pins as three equally important threads.

Take a moment to orient yourself before I start asking questions. Get a feel for the question list, the role mix of respondents, what the pin notes look like, and what each column is doing. I'll be asking detailed questions and changing direction often, so I need you fluent on the shape of the data.

A couple things to know:

- `survey_pins.sentiment` is forced to NULL by a DB trigger. Infer sentiment from question wording and pin notes.
- Some questions have skip rules built into them, so respondents who skip a section are a real cohort, not missing data. Look for these when you orient.

What I'm most interested in is what the survey doesn't ask directly: how structured ratings square with what people say in open-ended answers, themes that cut across questions of different types, spatial co-occurrence between "favorite" and "needs improvement" pins, places where students/faculty/staff disagree, parts of the campus that got no pins at all. Stay curious - if you spot something adjacent to what I asked, mention it.

When you give me numbers, include the denominator. When you quote a respondent (pin note or open-ended answer), quote it verbatim. Don't invent place names.

Start with a quick lay of the land - response count, role mix, anything that already looks unusual. Then ask where I want to dig in.
