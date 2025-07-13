../reXexl.sh
echo 'clean up done' 
echo 'git add . and so on'
git add .
echo "git commit -m \"Deploy updates $(date +%b-%d-%Y)\"" # Jul-14-2025

# echo 'git commit -m "Deploy updates $(date +%m-%d-%Y)"' # 7-14-2025
echo "git push -u origin main"


#
#  Explanation:
#
#   * echo "...": The outer double quotes allow the $(...) inside to be executed.
#   * \"...\": We have to escape the inner double quotes with a backslash (\) so they are printed
#     as part of the string.
#   * $(date +%b-%d-%Y): This runs the date command.
#       * %b: Abbreviated month name (e.g., Jul)
#       * %d: Day of the month (e.g., 01)
#       * %Y: Four-digit year (e.g., 2025)
#
#  Running that command will print this exact line to your terminal:
#   1 git commit -m "Deploy updates Jul-01-2025"

