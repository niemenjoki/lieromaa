This directory contains generated artifacts.

- `site/`: route and image allowlists generated during prebuild
- `commerce/`: prepared runtime discount data generated from editable source data and
  the optional sales-milestones snapshot fetched from the order service before a
  development or production build

Do not edit these files by hand. Update the source data under `/data` or rerun the
relevant prebuild generator.
