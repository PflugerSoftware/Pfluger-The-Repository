#!/bin/bash

# Shell script to copy and rename PowerPoint images for X25RB00-immersive project
# Generated from PowerPoint slide relationship files (.xml.rels)

# Source and destination directories
SRC_DIR="/Users/alexanderwickes/GitHub/ProjectEzra/src/data/projects/X25RB00-immersive/working/extracted/ppt/media"
DEST_DIR="/Users/alexanderwickes/GitHub/ProjectEzra/public/images/projects/X25RB00-immersive"

echo "Copying and renaming images from extracted PowerPoint..."
echo "Source: $SRC_DIR"
echo "Destination: $DEST_DIR"
echo ""

# Ensure destination directory exists
mkdir -p "$DEST_DIR"

# ===== KEY DIAGRAMS & FRAMEWORKS =====
echo "Copying key diagrams and frameworks..."

# Slide 3 - Vision diagram (image3.jpeg + image4.png which is recurring Pfluger logo)
cp "$SRC_DIR/image3.jpeg" "$DEST_DIR/vision-diagram.jpeg"

# Slide 15 - Bloom's Taxonomy (image12.png is the main diagram)
cp "$SRC_DIR/image12.png" "$DEST_DIR/blooms-taxonomy.png"

# Slide 16 - Apple Spatial Design (image13.png)
cp "$SRC_DIR/image13.png" "$DEST_DIR/apple-spatial-design.png"

# Slide 19 - PEAK Process (image17.png)
cp "$SRC_DIR/image17.png" "$DEST_DIR/peak-process.png"

# Slide 21 - Content Principles (multiple icons/images for principles)
cp "$SRC_DIR/image18.png" "$DEST_DIR/content-principles-01.png"
cp "$SRC_DIR/image19.svg" "$DEST_DIR/content-principles-icon-01.svg"
cp "$SRC_DIR/image20.png" "$DEST_DIR/content-principles-02.png"
cp "$SRC_DIR/image21.svg" "$DEST_DIR/content-principles-icon-02.svg"
cp "$SRC_DIR/image22.png" "$DEST_DIR/content-principles-03.png"
cp "$SRC_DIR/image23.svg" "$DEST_DIR/content-principles-icon-03.svg"
cp "$SRC_DIR/image24.png" "$DEST_DIR/content-principles-04.png"
cp "$SRC_DIR/image25.svg" "$DEST_DIR/content-principles-icon-04.svg"
cp "$SRC_DIR/image26.png" "$DEST_DIR/content-principles-05.png"
cp "$SRC_DIR/image27.svg" "$DEST_DIR/content-principles-icon-05.svg"
cp "$SRC_DIR/image28.png" "$DEST_DIR/content-principles-06.png"
cp "$SRC_DIR/image29.svg" "$DEST_DIR/content-principles-icon-06.svg"
cp "$SRC_DIR/image30.png" "$DEST_DIR/content-principles-07.png"
cp "$SRC_DIR/image31.svg" "$DEST_DIR/content-principles-icon-07.svg"
cp "$SRC_DIR/image32.png" "$DEST_DIR/content-principles-08.png"
cp "$SRC_DIR/image33.svg" "$DEST_DIR/content-principles-icon-08.svg"

# ===== HARDWARE FRAMEWORK DIAGRAMS (Slides 26-31) =====
echo "Copying hardware framework diagrams..."

# These slides share common framework images (image35-39.png)
cp "$SRC_DIR/image35.png" "$DEST_DIR/hardware-framework-base.png"
cp "$SRC_DIR/image36.png" "$DEST_DIR/hardware-framework-level1.png"
cp "$SRC_DIR/image37.png" "$DEST_DIR/hardware-framework-level2.png"
cp "$SRC_DIR/image38.png" "$DEST_DIR/hardware-framework-level3.png"
cp "$SRC_DIR/image39.png" "$DEST_DIR/hardware-framework-level4.png"

# ===== VENDOR IMAGES =====
echo "Copying vendor product images..."

# Slide 33 - EyeClick (interactive floor/wall projections)
cp "$SRC_DIR/image40.png" "$DEST_DIR/vendor-eyeclick-01.png"
cp "$SRC_DIR/image41.png" "$DEST_DIR/vendor-eyeclick-02.png"
cp "$SRC_DIR/image42.png" "$DEST_DIR/vendor-eyeclick-03.png"

# Slide 37 - Kids Jump Tech (general)
cp "$SRC_DIR/image46.jpeg" "$DEST_DIR/vendor-kidsjumptech.jpeg"

# Slide 38 - Kids Jump Tech (climbing wall)
cp "$SRC_DIR/image47.png" "$DEST_DIR/vendor-kidsjumptech-climbingwall.png"

# Slide 40 - Lü Interactive (video thumbnail image49.jpeg)
cp "$SRC_DIR/image49.jpeg" "$DEST_DIR/vendor-lu-interactive.jpeg"

# Slide 41 - Elumenati GeoDome
cp "$SRC_DIR/image50.jpeg" "$DEST_DIR/vendor-elumenati-geodome.jpeg"

# Slide 43 - WorldViz VR Simulation Room
cp "$SRC_DIR/image52.jpeg" "$DEST_DIR/vendor-worldviz-vr.jpeg"

# Slide 45 - BenQ Projectors
cp "$SRC_DIR/image54.png" "$DEST_DIR/vendor-benq-projector.png"

# Slide 46 - BenQ Case Study
cp "$SRC_DIR/image55.jpeg" "$DEST_DIR/vendor-benq-casestudy.jpeg"

# Slide 48 - zSpace AR/VR
cp "$SRC_DIR/image57.png" "$DEST_DIR/vendor-zspace.png"

# Slide 50 - ClassVR (image58.png)
cp "$SRC_DIR/image58.png" "$DEST_DIR/vendor-classvr.png"

# ===== SPACE TYPES (Slides 52-55) =====
echo "Copying space type diagrams..."

# Slide 52 - Space Type 1
cp "$SRC_DIR/image59.png" "$DEST_DIR/spacetype-01.png"

# Slide 53 - Space Type 2 (image59.png + image60.png)
cp "$SRC_DIR/image60.png" "$DEST_DIR/spacetype-02.png"

# Slide 54 - Space Type 3 (image59.png + image61.png)
cp "$SRC_DIR/image61.png" "$DEST_DIR/spacetype-03.png"

# Slide 55 - Space Type 4 (image59.png + image62.png)
cp "$SRC_DIR/image62.png" "$DEST_DIR/spacetype-04.png"

# ===== TM CLARK CASE STUDY (Slides 57-67) =====
echo "Copying TM Clark project images..."

# Slide 57 - TM Clark Overview (image63.png + image64.png)
cp "$SRC_DIR/image63.png" "$DEST_DIR/tmclark-logo.png"
cp "$SRC_DIR/image64.png" "$DEST_DIR/tmclark-overview.png"

# Slide 58 - Floor Plan
cp "$SRC_DIR/image65.png" "$DEST_DIR/tmclark-floorplan.png"

# Slide 59 - Details (image66-68.png)
cp "$SRC_DIR/image66.png" "$DEST_DIR/tmclark-detail-01.png"
cp "$SRC_DIR/image67.png" "$DEST_DIR/tmclark-detail-02.png"
cp "$SRC_DIR/image68.png" "$DEST_DIR/tmclark-detail-03.png"

# Slide 60 - Render Ocean
cp "$SRC_DIR/image69.png" "$DEST_DIR/tmclark-render-ocean.png"

# Slide 61 - Render Forest
cp "$SRC_DIR/image70.png" "$DEST_DIR/tmclark-render-forest.png"

# Slide 62 - Photo 1
cp "$SRC_DIR/image71.jpeg" "$DEST_DIR/tmclark-photo-01.jpeg"

# Slide 63 - Photo 2
cp "$SRC_DIR/image72.jpeg" "$DEST_DIR/tmclark-photo-02.jpeg"

# Slide 64 - Photo 3
cp "$SRC_DIR/image73.jpeg" "$DEST_DIR/tmclark-photo-03.jpeg"

# Slide 65 - Photo 4
cp "$SRC_DIR/image74.jpeg" "$DEST_DIR/tmclark-photo-04.jpeg"

# Slide 66 - Photo 5
cp "$SRC_DIR/image75.jpeg" "$DEST_DIR/tmclark-photo-05.jpeg"

# Slide 67 - Photo 6
cp "$SRC_DIR/image76.jpeg" "$DEST_DIR/tmclark-photo-06.jpeg"

# ===== OTHER PROJECTS (Slides 71-79) =====
echo "Copying other project reference images..."

# Slide 71 - Multi-project overview (image80-84.jpeg)
cp "$SRC_DIR/image80.jpeg" "$DEST_DIR/project-ref-01.jpeg"
cp "$SRC_DIR/image81.jpeg" "$DEST_DIR/project-ref-02.jpeg"
cp "$SRC_DIR/image82.jpeg" "$DEST_DIR/project-ref-03.jpeg"
cp "$SRC_DIR/image83.jpeg" "$DEST_DIR/project-ref-04.jpeg"
cp "$SRC_DIR/image84.jpeg" "$DEST_DIR/project-ref-05.jpeg"

# Slide 72 - Project detail (image81.jpeg + image85.jpeg)
cp "$SRC_DIR/image85.jpeg" "$DEST_DIR/project-detail-01.jpeg"

# Slide 73 - Project detail (image80.jpeg + image86.jpeg)
cp "$SRC_DIR/image86.jpeg" "$DEST_DIR/project-detail-02.jpeg"

# Slide 74 - Diagram
cp "$SRC_DIR/image87.png" "$DEST_DIR/project-diagram.png"

# Slide 75 - Additional renders (image88-89.png)
cp "$SRC_DIR/image88.png" "$DEST_DIR/project-render-01.png"
cp "$SRC_DIR/image89.png" "$DEST_DIR/project-render-02.png"

# Slide 76 - Render 3
cp "$SRC_DIR/image90.png" "$DEST_DIR/project-render-03.png"

# Slide 77 - Render 4
cp "$SRC_DIR/image91.png" "$DEST_DIR/project-render-04.png"

# Slide 78 - Render 5
cp "$SRC_DIR/image92.png" "$DEST_DIR/project-render-05.png"

# Slide 79 - Render 6
cp "$SRC_DIR/image93.png" "$DEST_DIR/project-render-06.png"

# ===== RECURRING ASSETS =====
echo "Copying recurring brand assets..."

# Pfluger logo (appears on most slides)
cp "$SRC_DIR/image1.png" "$DEST_DIR/pfluger-logo.png"
cp "$SRC_DIR/image4.png" "$DEST_DIR/pfluger-logo-alt.png"

echo ""
echo "Image copy complete!"
echo "Total images copied to: $DEST_DIR"
