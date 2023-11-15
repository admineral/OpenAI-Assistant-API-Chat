#####Git Befehle
Überprüfen des aktuellen Status
Um den aktuellen Status Ihres lokalen Repositories zu überprüfen, verwenden Sie:




# git status

########Verwerfen aller lokalen Änderungen
Um alle lokalen Änderungen zu verwerfen und zum letzten Commit zurückzukehren, verwenden Sie:


# git reset --hard HEAD



######Um die Änderungen, die Sie mit git stash apply wiederhergestellt haben, rückgängig zu machen, können Sie git checkout verwenden.

Führen Sie den folgenden Befehl aus, um die Änderungen in der package.json-Datei rückgängig zu machen:


# git checkout -- package.json





#########Entfernen aller unverfolgten Dateien
Um alle unverfolgten Dateien zu entfernen, verwenden Sie:


# git clean -fd



######Aktualisieren des Repositories
Um den neuesten Zustand des entfernten Repositories zu erhalten, verwenden Sie:


# git pull origin <branch_name>

Ersetzen Sie <branch_name> durch den Namen des Zweigs, den Sie aktualisieren möchten.



######Speichern von Änderungen mit Stash
Um Änderungen temporär zu speichern, verwenden Sie:

# git stash save "<description>"

Ersetzen Sie <description> durch eine Beschreibung Ihrer Änderungen.



#####Wiederherstellen von gespeicherten Änderungen
Um gespeicherte Änderungen wiederherzustellen, verwenden Sie:


# git stash apply


####### Rückgängig machen von Änderungen
Um Änderungen in einer bestimmten Datei rückgängig zu machen und zum letzten Commit zurückzukehren, verwenden Sie:



# git checkout -- <file_name>

Ersetzen Sie <file_name> durch den Namen der Datei, die Sie zurücksetzen möchten





####Mehrere Stashes

Sie können mehrere Stashes erstellen und diese separat verwalten. Wenn Sie git stash save "<description>" mehrmals ausführen, erstellt Git eine neue Stash jedes Mal.

Um alle Ihre Stashes anzuzeigen, verwenden Sie:

# git stash list



#### Anwenden spezifischer Stashes

Wenn Sie mehrere Stashes haben, können Sie einen spezifischen Stash anwenden, indem Sie seinen Namen angeben:

# git stash apply stash@{n}



#######vLöschen von Stashes

Sie können einen spezifischen Stash löschen, indem Sie git stash drop verwenden:

# git stash drop stash@{n}


Anwenden und Löschen von Stashes

Sie können einen Stash anwenden und ihn gleichzeitig löschen, indem Sie git stash pop verwenden:

git stash pop stash@{n}

Stashing unverfolgte Dateien

Standardmäßig speichert git stash nur Änderungen an bereits verfolgten Dateien. Wenn Sie auch unverfolgte Dateien speichern möchten, können Sie die Option -u oder --include-untracked verwenden:



git stash save -u "<description>"