# Pfluger Knowledge - CAD Standards

## Workflow

### GENERAL OFFICE

#### DESIGN APPLICATIONS/SOFTWARE

New applications are constantly being evaluated and adopted. Please refer to the *Pfluger Intranet* for a list of Design Applications & Software

#### EQUIPMENT

New technologies are constantly being evaluated and adopted. Please refer to the *Pfluger Intranet* for a list of equipment, and instructions on how to reserve it and how to use it.

#### LIBRARIES & TEMPLATES

Refer to the Design Technology page on the *Pfluger intranet* for the locations of Revit Libraries and Templates.

#### NEW VERSIONS & UPDATES

Will be rolled out when they have been tested and approved. It is important that everyone is on the same build of Autodesk Software to prevent model corruption. For this, individuals are not to install until directed.

### PROJECT START-UP

#### STARTING A NEW MODEL

- All project models with a contract shall live on Autodesk Construction Cloud (ACC).
  - The Project Architect (or Project Manager where a PA has not just been identified) shall **submit a ticket** for a new project on ACC to be created. The ticket should contain: Project Number & Project Name (as they appear in our ERP).
  - Initial Team Members with access to the project should, at a minimum, include the Project Manager, Project Architects, and Project Designers.
- Projects that do not have a contract can live in the cloud as well under the shared "Non Projects 20XX" folder. Submit a ticket to be added to it.
- Our Revit Template can be found in our Revit library (see *Pfluger Intranet* for location)
- If this is your first time starting a Revit model AT PFLUGER follow our standards in the appendix document, by watching the video on our youtube, or schedule a meeting with someone from the Design Technology Department and they will walk you through our standards.

NOTE: Ref *Pfluger YouTube Channel* for a walkthrough on how to set up your own model.

#### ACC PROJECT GUIDELINES

- Additional Team Members including Consultants will be managed by the Project Architect with support from the Project Manager as needed.
- Linking of Models will be coordinated through the established folder structure on BIM 360/ACC. Instructions will be provided to Consultants by the Project Architect
- Additional documentation will be coordinated by the Project Architect to include the use of BIM 360/ACC for project related PDF files (document sets). Non-Model related documents such as meeting minutes can be hosted in the proper folder location.
- Recovery of Models requires the inclusion of the Director of Technology as the first point of contact. Further steps to recovering models will be discussed at that time.

#### DESIGN KICKOFF MEETING

The **Project Manager** should schedule a kick-off meeting with the Project Architect and Project Designers to discuss scope, schedule, and deliverable requirements.

- The Project Architect will set up and provide access to Revit Models via BIM 360/ACC for all team members.
- Information on what is to be modeled shall be coordinated through the Project Architect to ensure that the model is set up correctly to meet the standards established by this document.

#### BIM KICKOFF MEETING

Depending on the structure of the project and contract requirements, before each project begins (ideally no later than the start of DD), it is important to have a meeting between project stakeholders to set the expectations for the model(s) and modeling methods for the project.

NOTE: Use the *BIM Kickoff Meeting Agenda.xlsx*, *BIM Kickoff Meeting Goals.docx*, *BEP.doc* (BIM Execution Plan), or *AIA_E203.pdf* located in the Appendix, to help identify the pertinent items.

### CONSTRUCTION ADMINISTRATION

#### PUNCH LIST

Pfluger's standard for punch lists is using Bluebeam. However, if the contractor has a software they prefer and are willing to give us licenses to, we can use their program.

NOTE: Ref *Pfluger YouTube Channel* for a walkthrough on how to conduct a punch list using Bluebeam.

### MODEL MAINTENANCE

*IMPORTANT: Unless otherwise delegated by the PM, the PA for each project will be the model manager. The model manager is responsible for model maintenance.*

#### PROJECT SAVE PAGE

Notes that should be recorded on the save page are nuances of a project that need to be communicated with anyone that will be working with the model. For example: if a link was brought in a certain way, or a workset is for something specific. When in doubt, note it. You can never have too much communication.

#### ROUTINE MODEL MAINTENANCE

- Models should be maintained per the schedule established in the BIM Kickoff Meeting or internally if a BIM Kickoff meeting does not occur. After project milestones (e.g. 50% DD, 75% CD, etc.) is the bare minimum that the model should be maintained.

NOTE: Ref appendix doc *Model Maintenance.pdf* for a walkthrough on model maintenance.

DYNAMO: we have several scripts that will save a lot of time in phase model maintenance
- *Find imported CAD files*
- *Find elements that are modeled in place*

- As part of Model Maintenance a copy of the model should be saved to an archive folder in the project's folder on the server.

#### CONTENT IMPROVEMENT

For Pfluger's content to evolve, throughout the life cycle of each project it is the responsibility of ALL TEAM MEMBERS to inform the Design Technology department, by **submitting a ticket**, of any observed areas of improvement. This includes any design technology currently used at Pfluger (e.g. Revit, Bluebeam, Enscape, etc.).

### TRANSMITTING / RECEIVING MODELS

#### CAD RELEASE FORMS

No models shall be transmitted to outside entities until award of bid has been completed.

**CAD Release forms** should always be filled out by those not in a direct contract relationship with one another prior to transmission.

NOTE: Ref specifications folder on the shared resources drive for release forms.

#### ACC AUTO-PUBLISHING

- Model Transmission should be managed through the ACC portal by publishing and permission features.
- Auto-publishing is standard at Pfluger and should be set up on every project unless it's a special circumstance.
- Publish settings must include sheets being issued as there are other departments (specs, QA/QC, etc.) that rely on this to review documents.

NOTE: Ref appendix doc *00 ACCPublishSettings.pdf* for a walkthrough on setting up auto-publish on ACC and modifying the publish settings within your project.

#### STAND ALONE PUBLISHING OUTSIDE ACC

If a stand-alone model is needed for clash detection, coordination, or archiving then the use of eTransmit in conjunction with the project folder on Egnyte is warranted. This application can be found within the "Add-Ins" tab within Revit.

NOTE: Ref appendix doc *e-Transmit.pdf* for a walkthrough on how to use this add-in.

#### RECEIVING MODELS

Models received by consultants (who are not working in ACC) need to be uploaded to ACC as if it were a new projects model. Once uploaded onto ACC they can be deleted from the server.

Ref appendix doc *00StartingNewModelModelStartupACC.pdf* for a walkthrough on how to do this.

#### FINAL ARCHIVING/ SURVEY

At the end of the project, a meeting should be scheduled by the project's model manager with the Design Technology Department to determine elements that can be incorporated in the Pfluger Revit library, and elements that might need to be revised.

## Modeling

### GENERAL

It is generally adopted that you model what you care about but be smart about it. You don't need to model everything. Consider the time that it takes to do the work in a way that conveys the design intent. Sometimes documenting it once as a typical is all that is needed. Modeling at different stages is different. Generally (where not called out otherwise by the contract), modeling in SD is much more for renderings than documentation, but you must still be mindful that your work affects every other phase, so if you knowingly take a shortcut, make note, communicate it so you or someone else can correct later.

#### FILE NAMING STRUCTURE

The following model naming standards apply only to models created by Pfluger:

**23-054_ARCH_Hall_RXX.rvt**

| Project Number | Discipline see abb. below | Model descript. if needed | Revit version | File extension |

The following four alpha characters shall be utilized as the DISCIPLINE

| Architectural | ARCH | Site | SITE | Furniture & Fixed Equipment | FFE |

NOTE: Consultants models do not have to named this way, but in the BIM Kickoff meeting, they are asked to put their discipline in the name of their model somehow.

#### WORKSETS

These are basic worksets and should be modified per project to best fit the project's needs.

| Name | Default Visibility Setting |
|------|---------------------------|
| ARCH | Visible in all views |
| INT – Floor Finishes | NOT visible in all views |
| INT – Furniture | NOT visible in all views |
| INT – Wall Finishes | NOT visible in all views |
| ENTOURAGE | NOT visible in all views |
| NIC | Visible in all views |
| SITE (this is if the site model is not separated) | NOT visible in all views |
| Shared Levels and Grids | Visible in all views |
| Z-LINK – [FILE SOURCE WITHOUT THE DOT] prefix for any linked files. Examples:<br>▪ Z-LINK – DWG Mechanical<br>▪ Z-LINK – RVT Structural | Visible in all views |

DYNAMO: we have a script that will create all of the standard Pfluger Worksets once the model has been workshare enabled.

#### WHEN TO SEPARATE OUT MODELS

If Models are large scopes of work, there can sometimes be a need to split the scope into several models. The site model is commonly split when there are multiple buildings on a site or there is complicated site work. The Furniture, Fixtures & Equipment (FFE) is commonly split into its own model when there is an FF&E Package. When in doubt consult your Design Technology Department.

### FAMILIES

#### EXTERNAL FAMILIES

Families not made at Pfluger need to be checked by the Project Architect before being brough into a project. Unless we have that firms permission in contract form, we should **NEVER USE ANOTHER COMPANIES REVIT CONTENT** (included but not limited to families, materials, styles, etc.) in our models. Use of this content puts Pfluger at risk of litigation.

If external families are approved by the PA on the project, check and modify them to conform with the standards outlined in this document.

NOTE: DWG imports in a family will cause issues with rendering, so try and stay away from using families with an imported .dwg geometry.

#### IN-PLACE FAMILIES

Limit in place modeling: in-place models take more file space and use more RAM for graphic generation.

DYNAMO: we have a script that will find all families that have been modeled in-place to help management of these

NOTE: reference the appendix document, In-Place Modeling.pdf for more information on in place modeling.

#### EDITING FAMILIES

- Dimension to reference planes
- Assign materials or material parameters
- Always "flex" the family after editing
  - Flex = Changing the value of parameters and observing those outcomes to ensure there are no errors or warnings.

#### FAMILY NAMING CONVENTION

Example:

**08-00-00_Door_Single**

| Master Format# | Building element type | Additional identifier (if needed) |

### FLOORS

#### ARCHITECTURAL

All floors should be drawn as they are intended to be constructed.

#### INTERIOR FINISH FLOORS

To document the materials and pattern a 1/8" thick floor is modeled on the INT-FINISH FLOOR workset.

DYNAMO: we have a script that will create finish floors for each room.

### WALLS

#### WALLS NAMING CONVENTION

This pertains to the naming of the system family within your Revit file

NOTE: Reference architectural document standards for standardized wall type naming convention

Example:

**INT_SA4R_60 MIN_coping**

| Interior or exterior of building. Will always be INT, EXT, or INT/EXT | Partition type as noted on partition type sheet* | Rating. If no rating leave this part empty. Always show in minutes (MIN) | Additional Identifier if needed |

\* Exterior partition types are named with material composition. Example: If you are unsure, ask or look at what's already in the template and follow that logic.

DYNAMO: we have a script that will create walls for each room.

#### INTERIOR WALL FINISHES

Interior wall finishes that have thickness should be a wall sweep where possible. Using a thin wall is acceptable where a sweep is not applicable but will need to be maintained throughout the project, because if a wall moves the thin wall will not. Locking these thin walls to the main walls is not advised as this slows down the performance of the model.

#### MODELING

Modeling methodologies depend on the application. Refer to the appendix document outlining some methods for wall modeling.

### CEILINGS

All ceilings should be drawn to the inside face of walls.

Use caution with auto sketch ceilings. This often puts ceilings in the walls and can create more work with building sections, wall sections, and detail sections.

Lights, Registers, Sprinklers, Tech etc. should all be modeled in the Architectural model(s) for location and the Consultants models for quantity. If it matters, model it. Unique special/high profile spaces will need it documented. Typical spaces can be modeled once and then referenced as typical, so mass changes are not needed.

NOTE: Reference the appendix document Ceilings.pdf for more information on modeling ceilings.

### MATERIALS

The texture files (photos, normal map, bump, etc.) for materials used in any project should be saved in either the Pfluger Master Materials Library or the Temporary Project Textures Library on the Shared Resources Drive (exact file path can be found on the Pfluger Intranet).

Naming Convention:
Division#_Material_Color_Manufacturer_Applications_SizeInches
Example:
04_Brick_Acme_Cocoa-221_Soldier_x32

### DOORS

Pfluger's door families are nested and the Shared Panel Type parameter is driven by the name of the panel family. If you are not an experienced modeler, please seek the help of someone who is, as the door family is complex.

#### CURTAIN WALL DOOR:

- Method 1: use the curtain walls door family (denoted with a CW in the family name). These families have no frame since the frame is the curtain wall mullion. To draw a door in a curtain wall, change the curtain wall panel to a Wall Type (rather than a panel family) and place the door in that wall as you would normally place a door in a wall.
- Method 2: Use the panel door family. Note: you will need to keep an extra eye on your door schedule, so you don't have fractional inches for your panel values.

Third Party door hardware plug-ins: Consult your Design Technology Committee member for best practices.

### DATUMS

#### GRID LINES

- North/ South Grids should be NUMERIC
- East/ West Grids should be ALPHA

#### LEVELS

- NAMING: Level 01, Level 02, etc
- PRACTICE:
  - Levels within Revit should only be made when there are many elements that need that level to change them (i.e. finish floors and roofs are most common), items like Top of Steel or Bottom of deck should only be used when fall within this. You should also utilize the "Building Story" parameter within the level family to be able to have these levels that you may not want to show up in certain views be quickly filtered out.
  - Where you just need to note the elevation in sections/elevations, use Spot Elevations (located under the annotation tab). Creating levels too close to one another can cause graphical issues.
  - NEVER DELETE A LEVEL unless you confirm by running a multicategory schedule that nothing is hosted to it.

### ANNOTATION

#### TEXT

- **ANNOTATION TEXT**
  - Text should always be capitalized
    - DYNAMO: we have a script that will
      - change most displayed text from lowercase to upper case to help management of these
      - tag all walls (omitting the walls without type marks) with the separate symbols for curtain walls
  - All annotation text should be Text Type Arial Narrow
  - Color is typically black, but can vary
  - Leader type is typically Arrow Filled 15 degrees, but can vary
  - Family Naming: FontSize FontType (Background)_COLOR_Leader
    - Example: 3/32" Arial (T)
    - Background: O=Opaque, T=Transparent
    - Color and Leader: when different from Pfluger's typical:
      - Example 1/4" Arial (O)_RED_ClosedCircle
- **MODEL TEXT**
  - Family Naming: MODEL TEXT_Purpose Size
    - Example: MODEL_Signage 1"

#### DIMENSION STYLES

- NAMING: DimensionType – FontSize FontType (Background) UnitType
  - Example: Linear – 3/32" Arial Narrow (O) Inches 1/8"
- DIMENSION TYPE: Aligned, Linear, Angular, Radial, Diameter, or Arc.
- FONT SIZE: Our standard is 3/32"
- FONT TYPE: Our standard is Arial Narrow
- BACKGROUND: O=Opaque, T=Transparent
- UNITS: Either Project Units or the units chosen if different than that (i.e. inches, feet, etc.)

#### LINE STYLES

- NAMING: LineWeight # - DescriptorOfPattern - Color
  - EXAMPLE: 1 - Dashed 1/16" - DrkGrey
- STANDARD REVIT TYPES: these line styles will remain to ensure cross collaboration with default Revit families. This includes; Hidden Lines, Insulation Batting Lines, Lines, Medium Lines, Thin Lines, Wide Lines

#### KEYNOTING

Pfluger's standard for noting contract documents is the Keynote function in Revit.

**TYPES OF KEYNOTES AND WHEN TO USE THEM**

- Element Keynote
  - Entire Wall/Floor/Ceiling assemblies
  - Structural Elements
  - Family Objects
- Material Keynote
  - Materials within a wall/floor/ceiling assembly. (ie. 5/8" gypsum wall board, 4" metal studs @ 18" O.C)
  - Finish materials assigned to floor/wall/ceiling assemblies "finish" layer.

Ensure all Keynotes are placed in all capital letters.

When adding keynotes, one should follow the division to which they relate.
For Example: Keynotes added related to various tile flooring elements should remain within the DIVISION 09 or 09 keynote section.

Use of the keynote manager application within Revit is highly encouraged for accurate keynoting on projects.

NOTE: Ref Pfluger YouTube Channel for a walkthrough on how to use Keynote Manager.

### PHASES AND PHASE FILTERS

#### PHASES

- The Pfluger template contains Existing and New Construction.
- Future phase may be added. When naming, try to be as descriptive as possible.
- DO NOT use demo as a phase. In Revit demolish is an action. If elements need to be demolished, they should be demolished in the corresponding phase.
- Rooms cannot show up in multiple phases. To get around this you may need to use text to label existing rooms in a demolition drawing.

NOTE: Element's in future phases will not show up in views, however elements can still cause conflicts and graphical "issues" with joining, so weigh this as you are strategizing your modeling method. Phases can be combined with past and future phases.

#### PHASE FILTERS AND OVERRIDES

Should be set up as follows with the corresponding graphic overrides

**PHASE FILTERS:**

| Filter Name | New | Existing | Demolished | Temporary |
|------------|-----|----------|------------|-----------|
| 1. Show All | By Category | Overridden | Overridden | Overridden |
| 2. Show Complete | By Category | By Category | Not Displayed | Not Displayed |
| 3. Show Demo + New | By Category | Not Displayed | Overridden | Overridden |
| 4. Show New | By Category | Not Displayed | Not Displayed | Not Displayed |
| 5. Show Previous | Not Displayed | Overridden | Not Displayed | Not Displayed |
| 6. Show Previous + Demo | Not Displayed | Overridden | Overridden | Not Displayed |
| 7. Show Previous + New | By Category | Overridden | Not Displayed | Not Displayed |

**GRAPHIC OVERRIDES:**

| Phase Status | Projection/Surface |     | Cut |     | Halftone | Material |
|--------------|-------------------|-----|-----|-----|----------|----------|
|              | Lines | Patterns | Lines | Patterns |          |          |
| Existing     | ------------- |     |     |     | ☐ | Phase - Exist |
| Demolished   | ------------- |     | ------------- | Hidden | ☐ | Phase - Demo |
| New          | _________ |     |     | ■■■■■■ | ☐ | Phase - New |
| Temporary    | ................. |     | ................. | ///////// | ☐ | Phase - Temporary |

### DESIGN OPTIONS

Used to convey Alternate Scope in Projects (not to be confused with Worksets for different options to apply to the same condition).

- Typically, Design Options are introduced after the Base Bid Scope is modeled, with modifications to that Scope as needed.
- Design Options need to be communicated clearly to consultants so that they can show the correct information in their drawings. Consult with the Project Architect for more information.
- Naming Convention: Both sets and options should named to convey their content. Don't solely use "Option 2" instead try "Option 2: Science Lab"
- Most sets should have an option that is "empty" and set to primary, so content that is not wanted will show by default.

NOTE: Ref Pfluger YouTube Channel for a walkthrough on how to use design options.

### PROJECT UNITS

- **LENGTH**
  - Units: Feet and Fractional Inches
  - Rounding: to nearest 1/256"
  - Suppress 0 feet
- **AREA**
  - Units: Square feet
  - Rounding: 0 decimal places
  - Unit Symbol: SF
  - Suppress trailing 0's
- **VOLUME**
  - Units: Cubic feet
  - Rounding: 2 decimal places
  - Unit Symbol: CF
  - Suppress trailing 0's
- **ANGLE**
  - Units: Decimal degrees
  - Rounding: 2 decimal places
  - Unit Symbol: ∘
  - Suppress trailing 0's
- **SLOPE**
  - Units: Rise/ 12"
  - Rounding: to the nearest 1/256"
- **CURRENCY**
  - Rounding: 2 decimal places
  - Unit symbol: $
  - Suppress trailing 0's
- **MASS DENSITY**
  - Units: Pounds per cubic foot
  - Rounding: 2 decimal places
  - Unit symbol: lb/ft³
  - Suppress trailing 0's

**IMPORTANT: you MUST model in 1/256" if you model using a rounded dimension, that's not a true dimension. The rounded dimension you see isn't guaranteed to be that dimension. For example, if you round to the nearest ¼" your element could anywhere within 0"-1/4" There have been instances where this was not adhered to, and it created major issues.**

### LINKING FILES

- Linking between Revit Models should be origin to origin. However, this cannot always happen. If linking needs to occur after two models have elements in them, shared coordinates should be used
  - NOTE: ref appendix document, Tip_Points.pdf
- CAD FILES: Only Link. Center to center and then rotated & moved. This is extremely important because the #1 cause of a slow performing model is imported CAD files.
  - NOTE: ref appendix document, Link_DWG.pdf
  - DYNAMO: we have a script that will report on how CAD files are inserted into a project (e.g. linked v imported) to help model management
- ACC: All linked files (Revit, CAD, etc.) shall be saved to the appropriate folder in the ACC project file and then linked. DO NOT link any content from your local computer or local Teams/Sharepoint Folder.
  - i. Pfluger Standard it to use the live linking methodology for Revit to Revit Linking.

### DRAWINGS

#### DRAWING INDEX

Drawing indexes can be formed in two ways

- Dummy Data: in the index schedule, you can input rows of data for sheets that are not issued by Pfluger so they appear in our index of drawings.
- Link Sheets into Index: this requires coordination with consultants.
  - NOTE: Reference the appendix document drawing index.pdf
  - DYNAMO: we have a script that will create sheets or dummy sheets based on an excel file

#### LIFE SAFETY PLANS

The Life safety plan shall act as a one-stop reference for the design team, AHJ, and contactor for the code requirements that shaped the design. Information should be limited only to what is needed to convey the code solutions; other extraneous info should be hidden. Special care should be taken to ensure that graphical indications of rating or barrier are legible at the scale presented.

Pfluger's life safety plans are heavily dependent on view filters and visibility graphic settings. The filters are dependent on the Fire Rating parameter, ensure that this parameter is filled out and that you are using the Life Safety View Template. In additions to graphics, these elements need to be included/calculated

- Legend: should be filled out according to the Life Safety Analysis for your building.
  - NOTE: reference Pfluger Intranet for video guide on how to perform a Life Safety Analysis.
- Fire Cabinets and Extinguishers
- Longest path of travel
  - NOTE: reference the appendix document Revit Longest Path.pdf
- Exit width indicators.
- Room Tag with occupancy totals
  - DYNAMO: we have a script that will apply the calculated value of occupants to the parameter in the room tag
- Fire Areas
- Areas (rated tunnel/corridor, area of refuge, etc.)

#### DEMOLITION PLANS

Demolition plans should cover all items and assemblies that must be removed to allow new construction to commence. General description tags can be placed per room for large unitary items (e.g., remove carpet). Items that a bidder would need to assign additional value to remove should be individually called out. Demo notes shall be objective and quantitative and shall avoid nebulous unbiddable statements. Descriptions should not creep into new work scope (e.g., patch and paint); follow up in new work scope to cover said items.

- Phase & Phase Filtering: the phase of the view should be set to New Construction, and the Phase Filter should be set to Show Previous and Demo.
- Demo Keynotes: using an annotation symbol and Note Block, note scope of work
- Not all things can be shown using modeling. There may be times where you will need to use detail items to denote items for demo.
- Additional drawings: other drawings may need to be used to identify important items for demolition. If it's important, call it out.

#### DOOR SCHEDULE

- Door schedules should be used to convey styles, height, width and any other unique and relevant identifying information for your project. Use of this space to delineate between emergency egress doors and convenience/security doors is useful. The measurements shown in the door schedule should represent the actual door width. Rough opening sizes need not be shown in the door schedule. When using 3rd party door management software be sure to only import information relevant to your project into the door schedule
- When working with existing conditions use of the phase filter within the door schedule will aide in clearly communicating design intent and hardware needs for the projects.

DYNAMO: we have the following scripts that will save you IMENSE amounts of time in regard to doors:
- Number doors to match room numbers
- Export/Import Door HDW Data via excel
- Retrieve wall type doors are in (for use with schedule key to autofill HJS details)
- Finds doors in walls that are thicker than allowed by ADA

### VIEWS

#### WORKING IN VIEWS

As you work in the model, it is important to pay attention to how you organize views and the level the view is associated with, for the following key reasons:

- Most modeled elements are hosted to levels. When those elements are placed in a plan view, they will be hosted to the level that is associated with the level of the view placed in.
- Some view types become linked to the view they were created in. For instance, elevations, sections, and callouts are associated with the view they were created in and if that view is deleted, the elevations, sections and callouts would be deleted as well.
- Renaming a View Name parameter can sometimes prompt you to "rename corresponding levels and views," do not click yes unless you intend to have the Level and other view associated with that level renamed.
- It is highly encouraged that you have a 3D view of the area you are working in open alongside the floor plan view you are placing the modeled elements in
- Working views: use working views for temporary annotations and visibility settings. DO NOT change views on sheets for work these changes.
- If items are constantly being hidden using "Element Hide" in views, consider hiding that element's category.
- Plan Regions: On projects with multiple floor elevations that fall on the same "floor level", adjust the cut plane carefully to show doors, windows, and other floor hosted items are displayed correctly. Use Plan Regions to help in extreme cases. MODELLING work should be done in views hosted to the appropriate level.
- Temporary View Properties: Temporarily suspends view template control to allow non-permanent visibility changes when researching in a view.

#### VIEW TYPES

In addition to naming the view to help clean and allow others to navigate more easily, making sure that you have your view categorized withe the correct view type. A view type can also apply a view template to help ensure that your graphics are displaying correctly. An important view type is the WORKING view type for every category. This view type allows you to modify the visibility graphics settings of your personal view to highlight elements that you might be focusing on (e.g. rooms, doors, etc).

#### VIEW TEMPLATES

Views placed on sheets shall use the respective Pfluger View Template to ensure that the appropriate content is displayed per view type. Pay careful attention to any edits you make to the template for a particular view, as that edit will change the visibility graphics on all sheets using the template.

- Filters can be added to the View Template to filter out unplaced views, sections, unwanted levels, and other items that are not appropriate to be seen in the view series.

#### WORKSHARING DISPLAY TOOLS

To determine who has edited an element OR who has checked out an element, use "Worksharing Display". Turn on any of the modules below and then hover over the element to:

- "Checkout Status" shows what has been checked out the element from the central model
- "Owners" shows who has checked out the element from the central model; and displays who created and last edited an element.
- "Model Updates" shows recently edited or deleted elements
- "worksets" color codes all worksets in a view to help distinguish workset.

#### VIEW NAMES

- View Names should be organized to allow for easy identification within the project browser and when using the "reference other view" tool drop down list.
- View names should not show up on sheets (if you are seeing the view name on the sheet, you need to input a value for the field "Title on sheet").
- All view names and titles on sheets should be in ALL CAPITAL LETTERS
- Naming Convention: The format for View Names should be as follows: [prefix] - [description]
  - To organize this part of the model, we will use a two-letter prefix naming system for view names.
    - FP – Floor Plan
    - RP - Roof Plan
    - FN - Finish Plan or Detail
    - RCP - Reflected Ceiling Plan
    - EP – Enlarged Floor Plan
    - WS - Wall Section
    - BS – Building Section
    - PD – Plan Detail
    - SD – Section Detail
    - CD - Ceiling Detail
    - MD - Millwork Detail
    - EE – Exterior Elevation
    - IE – Interior Elevation
    - DEP – Department Plans
    - WORK or [USER NAME] – Working Views
  - The two-letter designation should be followed by a short **description**
    - For wall and detail sections, always start with the wall construction (ex: TW, STONE, BRICK) followed by the @ symbol and a description of the section cut.
      - Examples:
      - WS-CFMF-Brick@Canopy
    - For Plan Details, use the structural grid location OR the item being cut. Remain consistent throughout the project.
      - Examples:
      - PD-D/12.1
      - PD-STOREFRONT@ BRICK WALL JAMB
      - PD-BRICK VENEER WALL @ PARAPET
- For Interior Elevations, always use the plan segment, room number & name followed by either a compass direction or the @ symbol and a further description if necessary.
  - Examples:
  - IE-A103.1 SCIENCE WEST
  - IE-B105.2 CONCESSION @ RECYCLING STATION

### BEST PRACTICES

#### POP-UPS

Read all pop ups. The message being displayed is being displayed for a reason. If you don't know what it means, press F1 (Revit's help), search it on the internet, or ask your model manager.

#### SYNC TO CENTRAL (STC)

- Too many people syncing to central at the same time increases the likelihood of a corrupt model. A way to avoid this is to look at the bottom of the Revit window and if the icon looks like a cube, you are safe to sync. If the icon looks like a red arrows in a circle then someone else is syncing and you should wait a minute
  - NOTE: Ref the appendix document Workshare Enabled Projects.pdf for more information on syncing to central.
- Sync with modified settings: There are two options with syncing. Sync Now or Sync with Modified settings. Sync with modified settings is quicker & safer because it will allow you to sync to central without any additional steps and shows you where they file location is, what you are relinquishing, and an opportunity to make comments. The comment section is extremely helpful when you are trying to recover a central model.

#### PERFORMANCE ENHANCEMENTS

- Loading Worksets: When you open the model, only open worksets that you know you will be needing to see. Doing this saves on virtual memory and will increase your performance. Be cognizant of what you REALLY need to see and what you don't. When you can't see/ find a modeled element it may be on one of these closed worksets.
  - NOTE: Ref saving model section in the New Model Start Up.pdf appendix document that is located in the appendix, for instructions on how to set up a model to prompt you with this.
- Groups: Be aware that groups take up a lot of memory. Be aware of the pros and cons of groups.
  - NOTE: Ref appendix document Groups.pdf for more detailed information on groups.
- Instance Parameters: Be aware that instance parameters take up more memory than type based parameters. Be familiar with the pros and cons of instance vs. type based parameters.
  - NOTE: Ref appendix document Parameters.pdf for more detailed information on instance parameters.
- Constraining elements (in a project): includes pinning, EQ dimensions, locking. This can increase your risk of model corruption.

#### DWG FILES IN PROJECT

NEVER IMPORT .dwg files in projects. See appendix document titled Linking DWG.pdf

#### REFRESH

It is recommended, by Autodesk, to close out of Revit every 4-5 hours and grab a new local copy of your files before resuming work.

#### SHORTCUTS

Create a shortcut to the central model so you don't have to go looking for the file every time you need to get a new local.

NOTE: Reference the appendix document Tips_Favorites.pdf for a tip on how to make a folder a favorite for easy reference

## Graphics

### SHEETS

NOTE: CLIENT STANDARDS WILL ALWAYS SUPERSEDE THESE STANDARDS. ENSURE THERE ARE NO CLIENT STANDARDS BEFORE PROCEEDING WITH THE STANDARDS BELOW.

#### SHEET NUMBERS & NAMES

Refer to the Drawing Standards Document for Naming Convention and ordering

#### VIEW TITLE ON SHEETS

- Should be placed at the bottom right corner of a view and ALIGNED with neighboring view titles whenever possible.
- Above anything else, be consistent throughout the drawing set.
- Titles on Sheets are the text that we will see on the document sheets and should be named accordingly to the formats outlined below.
- Floor plans:
  - LEVEL 01 - FLOOR PLAN
  - LEVEL 01 – FLOOR PLAN - SEGMENT C
- Enlarged floor plans:
  - ENLARGED PLAN @ [Room Name & Number]
- Exterior elevations - use the compass direction followed by the word elevation
  - EAST ELEVATION
  - ELEVATION @ BLACK BOX THEATER
- Building sections, wall sections, section details and plan details, simply use those generic titles in capital letters.
  - BUILDING SECTION
  - WALL SECTION

#### VIEW NUMBERING & PLACEMENT

- Views that are related (ex: head and sill, wall sections) should be aligned.
- Sheets should be numbered starting at the bottom right corner of the page - go left – then up. Example:

8 7 6 5

4 3 2 1

DYNAMO: we have a script that will align/layout views on the sheet as long as they are numbered in the order you want them on the sheet as depicted above.

#### KEY PLANS

- On title blocks:
  - Can be built into the title block for easy manipulation.
  - Primarily used for building segment plans.
  - Composite plans do not need a key plan.
- On Views:
  - Key plans should be built into the view family
  - Views that typically use key plans: floor plans, roof plans, enlarged plans, and plan details. View that key plans are helpful in as well are building sections, wall sections, and building elevations.

#### ANNOTATIONS

- Leaders of text notes should be angled when possible.
- Should be ALIGNED with other annotations whenever possible. This includes sections, grid bubbles, levels, and text
- Do not overlap with other drawings on the page
- Levels that are visible but are not relevant to a current elevation or section view may be hidden using a filter or the element view override. Don't delete them!
- CAPITALIZE EVERYTHING
- All annotations should be 3/32" to ensure you can read the text when a drawing is printed at half size.

### REVISIONS

After documents have been issued to an AHJ and/or a contractor, revisions to drawings and specs shall be tracked by revision clouds and tags (deltas). Use the Revit "Sheet Issue/Revisions" dialog to manage revisions.

- Sheet size: issued as full-size sheet PDFs
- Sheet issue/revision Revit settings:
  - Numbering: numbering shall be set "Per Project"
  - Naming & Date: appropriate short description (e.g., ADDENDA 01) and date of issue set.
  - Show: once a revision has been issued, "Show" shall be set to "Tag" only. Only the current revision being issued shall have clouds visible.
  - Issued function: mark the "Issued" box once a revision has been issued.
- Graphic indication: Clouds shall mark the revised item such that a bidder can objectively identify what has changed. Clouds and tags shall not obscure adjacent graphics or text. Clouds need not be closed; gaps in cloud edge can be used to avoid overwriting other graphics. Clouding an entire sheet should be avoided. If the sheet is newly issued in the revision, clouding the sheet name and number block on the border is sufficient (keep cloud completely on the outside of name/number border area to avoid confusing Bluebeam automatic titling functions).

DYNAMO: we have a script that will list all revisions on all sheets in an excel file.

- Schedule Revisions: Changes to scheduled items shall be marked by adding the revision number to the "revisions" column of the schedule in a similar fashion that one would add content to the "comments" column. This will ensure that the revision indicator will always remain with the modified door/room. A small revision cloud shall then be added on the sheet at the "revisions" column header so that the sheet border will automatically track the revision on the sheet revision schedule.

NOTE: Refer to Revisions.pdf in the Appendix for a how to on revisions.

- To assist in collating sheets with revisions, create a sheet index that filters for revision on sheet.
- Where to put the revisions: This is an age-old debate that the Revit community is torn on. It is important at the beginning of the project to establish what will be done in your project: to model on the sheet, or in the view. Below are the cons of each option (Pros are the opposite of the other options list):

| On Sheet (preferred) | On View |
|----------------------|---------|
| a. If you move a view revisions will not move with it.<br>b. You cannot see the revisions if you work in only the view. | a. They show up in linked views of consultants.<br>b. Will appear if duplicate a view<br>c. Remaining consistent is key. Revisions cannot appear in: schedules, families (i.e. title blocks), or deleted views.<br>d. You cannot see the revision delta if in a Legend or if the cloud crosses a match-line. |

## Appendix A - Documents

Pfluger Intranet
Pfluger YouTube Channel
New Model Start Up.pdf
Workset Enabled Projects.pdf
BIM Kickoff Meeting Goals.docx
BIM Kickoff Meeting Agenda.xlsx
BEP.doc
AIA_E203.pdf
Model Maintenance.pdf
Pfluger File Structure.pdf
In-Place Modeling.pdf
Parameters.pdf
Ceilings.pdf
Tip_Points.pdf
Link_DWG.pdf
Workshare Enabled Projects.pdf
Groups.pdf
Parameters.pdf
Tips_Favorites.pdf

## Appendix B – Dynamo Scripts

Find imported CAD files
Find elements that are modeled in place
Number doors to match room numbers
Export/Import Door HDW Data via excel
Retrieve wall type doors are in (for use with schedule key to autofill HJS details)
Finds doors in walls that are thicker than allowed by ADA

